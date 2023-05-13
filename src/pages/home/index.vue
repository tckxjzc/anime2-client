<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import NavBar from 'vant/lib/nav-bar';
import VanIcon from 'vant/lib/icon';
import VanList from 'vant/lib/list';
import VanPullRefresh from 'vant/lib/pull-refresh';
import {showToast} from "vant/lib/toast";
import VanSticky from "vant/lib/sticky";
import VanField from "vant/lib/field";
import {useListStore} from "@/stores/list";
import {getList} from "@/api";
import {useRouter} from 'vue-router';

const router = useRouter();
const listStore = useListStore();
const state = reactive({
    loading: false,
    finished: false,
    refreshing: false,
    keyword:'',
    searching:false,
});
const inputEl = ref ();
const title = computed(()=>listStore.keyword||'动漫下载');

async function load(flag = false) {
    import.meta.env.VITE_APP_ENV && console.log('load');
    // if(state.loading && !flag){
    //     return;
    // }
    state.loading = true;
    try {
        const data = await getList(listStore.page, listStore.keyword);
        if (data.list.length === 0) {
            state.finished = true;
        } else {
            listStore.updateList(data.list, flag);
            if (listStore.page === 1) {
                listStore.total = data.total;
            }
            state.finished = listStore.page === listStore.total;
        }
        listStore.next();
    } catch (e) {
        console.log('error', e);
        showToast(e.message);
    }

    state.loading = false;
    console.log(state.loading);
}

function handleItemClick(e) {
    let i = 0;
    let el = e.target;
    while (el.className !== 'card') {
        el = el.parentElement;
        if (i > 2) {
            return;
        }
        i++;
    }
    const id = el.getAttribute('data-ani-id');
    const item = listStore.list.find(i => i.id === id);
    if (!item) {
        return;
    }
    router.push({
        name: 'detail',
        params: {id},
        query: {title: item.title}
    })
}
async function search(){
  listStore.updateKeyword(state.keyword);
  listStore.go(1);
  listStore.updateList([]);
  state.searching = false;
  await load(true);

}
function reset(){
  listStore.go(1);
  listStore.updateKeyword('');
  listStore.updateList([],true);
  load(true);
}

async function refresh() {
    listStore.go(1);
    await load(true);
    state.refreshing = false;
}
function openSearch(){
  state.searching = true;
  inputEl.value?.focus();
}
function closeSearch(){
  state.searching = false;
}

if (listStore.list.length === 0) {
    load();
}
</script>

<template>
    <div class="container">
        <van-sticky>
          <nav-bar :title="title">
            <template #left>
              <van-icon @click="reset" name="wap-home" size="24" color="#fff"/>
            </template>
            <template #right>
              <van-icon @click="openSearch" name="search" size="24" color="#fff"/>
            </template>
          </nav-bar>
          <nav-bar :class="['search',{show:state.searching}]">
            <template #left>
              <van-icon @click="closeSearch" name="exchange" size="24" color="#333"/>
            </template>
            <template #title>
              <van-field
                  ref="inputEl"
                  v-model="state.keyword"
                  @keydown.enter="search"
                  placeholder="搜索">
              </van-field>
            </template>
            <template #right v-if="state.keyword">
              <van-icon @click="state.keyword=''" name="cross" size="24" color="#333"/>
            </template>
          </nav-bar>
        </van-sticky>
        <div class="list" @click="handleItemClick">
            <van-pull-refresh v-model="state.refreshing" @refresh="refresh">
                <van-list
                        v-model:loading="state.loading"
                        :finished="state.finished"
                        finished-text="没有更多了"
                        @load="load"
                >
                    <div class="card"
                         v-for="item in listStore.list"
                         :key="item.id"
                         :data-ani-id="item.id"
                    >
                        <div class="title">
                            {{ item.title }}
                        </div>
                        <div class="info">
                            <span>{{ item.updateTime }}</span>
                            <span>{{ item.size }}</span>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 100vh;
}

.list {
    height: calc(100vh - 3rem);
    overflow-y: scroll;
    background-color: #f1f1f1;
}

.card {
    padding: 0.5rem 0.7rem 0.8rem 0.7rem;
    background-color: #fff;
    margin-bottom: 0.8rem;
}

.info {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    color: #999;
    font-size: 0.8rem;
}
.search{
  position: absolute;
  overflow: hidden;
  right: 0;
  top: 0;
  width: 0;
  background-color: #fff;
  transition: width 300ms;
}
.search.show{
  width: 100vw;
}
</style>
