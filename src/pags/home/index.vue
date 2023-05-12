<script setup lang="ts">
import {reactive, ref} from "vue";
import NavBar from 'vant/lib/nav-bar';
import VanIcon from 'vant/lib/icon';
import VanList from 'vant/lib/list';
import VanPullRefresh from 'vant/lib/pull-refresh';
import {showToast} from "vant/lib/toast";
import {useListStore} from "@/stores/list";
import {getList} from "@/api";
import {useRouter} from 'vue-router';

const router = useRouter();
const listStore = useListStore();
const state = reactive({
    loading: false,
    finished: false,
    refreshing: false,
});

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

async function refresh() {
    listStore.go(1);
    await load(true);
    state.refreshing = false;
}

if (listStore.list.length === 0) {
    load();
}
</script>

<template>
    <div class="container">
        <nav-bar title="title">
            <template #left>
                <van-icon name="wap-home" size="24" color="#fff"/>
            </template>
            <template #right>
                <van-icon name="search" size="24" color="#fff"/>
            </template>
        </nav-bar>
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
    display: flex;
    flex-direction: column;
}

.list {
    flex: 1;
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
}
</style>
