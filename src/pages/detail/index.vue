<script setup lang="ts">
import {useRoute} from 'vue-router'
import {reactive} from "vue";
import {getDetail} from "@/api";
import VanButton from "vant/lib/button";
import {encode} from 'js-base64';
import axios from "axios";
import {showToast} from "vant/lib/toast";
import VanIcon from "vant/lib/icon";
import NavBar from "vant/lib/nav-bar";
import VanSticky from "vant/lib/sticky";
import VanLoading from "vant/lib/loading";
import {useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const title = route.query.title;
const state = reactive({
  detail: '',
  downloadUrl: `magnet:?xt=urn:btih:${id}`,
});

function generateUniqueId() {
  const sourceId = 'AriaNg_' + Math.round(new Date().getTime() / 1000) + '_' + Math.random();
  return encode(sourceId);
}

async function cloundDownload() {
  const id = generateUniqueId();
  try {
    await axios.post('/jsonrpc',
        {
          jsonrpc: "2.0",
          method: "aria2.addUri",
          id,
          params: ["token:81705726", [state.downloadUrl], {}]
        }
    );
    showToast('任务添加成功!')
  } catch (e) {
    showToast('出错了,可能未开vpn!')
  }
}

function download() {
  state.downloadUrl && window.open(state.downloadUrl);
}

function goBack() {
  router.back();
}

async function getData(id: string) {
  const data = await getDetail(id);
  Object.assign(state, data);
}

getData(id);
</script>

<template>
  <div class="container">
    <van-sticky>
      <nav-bar :title="title">
        <template #left>
          <van-icon
              @click="goBack"
              name="arrow-left"
              size="24"
              color="#fff"/>
        </template>
      </nav-bar>
    </van-sticky>
    <h3>{{ title }}</h3>
    <van-loading v-if="!state.detail" />
    <div class="content-wrapper" v-html="state.detail"></div>
    <div class="controls" v-show="state.downloadUrl">
      <van-button
          square
          icon="guide-o"
          @click="cloundDownload">
      </van-button>
      <van-button
          square
          icon="down"
          @click="download">
      </van-button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  word-break: break-all;
  text-align: center;
}

.controls {
  position: fixed;
  right: 0.8rem;
  bottom: 3rem;
  display: flex;
  flex-direction: column;
}

.van-button + .van-button {
  margin-top: 1rem;
}

.content-wrapper {
  width: 100vw;
}

:deep(.content-wrapper) img,
:deep(.content-wrapper) p,
:deep(.content-wrapper) div {
  max-width: 100% !important;
}
.van-loading{
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}
</style>
