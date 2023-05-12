
import { defineStore } from 'pinia'

export const useListStore = defineStore('list', {
  state: () => ({
    page:1,
    keyword:'',
    list:[] as Record<string, any>,
    total:1,
  }),
  actions: {
    next(){
      this.page++;
    },
    go(page:number) {
      this.page = page;
    },
    updateKeyword(keyword:string){
        this.keyword = keyword;
    },
    clearKeyword(){
        this.keyword = '';
    },
    clear(){
      this.list = [];
    },
    updateList(list:Record<string, any>[],clear= false){
      if(clear){
        this.list = list;
      }else{
        this.list.push(...list);
      }
    }
  }
});
