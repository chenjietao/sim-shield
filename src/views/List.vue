<template>
  <div>
    <!--
    <div class="header fix-top">
      <mu-tabs center :value.sync="activeTab" @change="handleTabChange()">
        <mu-tab>待办</mu-tab>
        <mu-tab>已办</mu-tab>
      </mu-tabs>
      <div class="search-bar">
        <div class="search-bar-input">
          <mu-text-field v-model="keyword" full-width placeholder="请输入关键字..." icon="search" :action-icon="keyword ? 'clear' : 'hide'" :action-click="clearKeyword"></mu-text-field>
        </div>
        <div class="search-bar-btn">
          <mu-button color="primary" @click="handleSearch()">搜索</mu-button>
        </div>
      </div>
    </div>
    -->
    <div class="header fix-top">待办列表</div>
    <div class="main fix-bottom">
      <mu-load-more :refreshing="isListRefreshing" :loading="isListLoading" :loading-text="listLoadingText" :loaded-all="isListLoadedAll" @refresh="handleListRefresh()" @load="handleListLoad()">
        <mu-list textline="two-line">
          <mu-list-item v-if="dataEmpty" style="margin-top: 60px;">
            <p class="empty-info"><mu-icon value="error" :size="48"></mu-icon><br>列表数据为空</p>
          </mu-list-item>
          <mu-list-item v-if="!dataEmpty" button v-for="item in list" :key="item.tel" @click="jumpDetails(item.id)">
            <mu-list-item-content>
              <mu-list-item-title>{{item.appliTitle}}</mu-list-item-title>
              <mu-list-item-sub-title>{{item.applidate}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="info"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-load-more>
    </div>
  </div>
</template>

<script>
import dataServices from "../services/dataServices";

export default {
  data() {
    return {
      activeTab: 0,
      keyword: "",
      keywordStore: "",
      isListRefreshing: false,
      isListLoading: false,
      isListLoadedAll: false,
      listLoadingText: "加载更多...",
      pageSize: 100,
      currentPage: 1,
      dataEmpty: false,
      list: []
    };
  },
  methods: {
    clearKeyword() {
      this.keyword = "";
    },
    handleTabChange() {
      this.keyword = "";
      this.keywordStore = "";
      this.currentPage = 1;
      this.pageSize = 100;
      this.getList();
    },
    handleSearch() {
      if (this.keyword !== this.keywordStore) {
        this.keywordStore = this.keyword;
        this.currentPage = 1;
        this.pageSize = 100;
        this.getList();
      }
    },
    handleListRefresh() {
      let oldSize = this.pageSize,
        oldPage = this.currentPage;
      this.isListRefreshing = true;
      this.currentPage = 1;
      this.pageSize = oldSize * oldPage;
      this.getList(() => {
        this.$nextTick(() => {
          this.isListRefreshing = false;
          this.pageSize = oldSize;
          this.currentPage = oldPage;
        });
      });
    },
    handleListLoad() {
      if (!this.isListLoadedAll) {
        this.isListLoading = true;
        this.currentPage += 1;
        this.getList(() => {
          this.$nextTick(() => {
            this.isListLoading = false;
          });
        });
      }
    },
    getList(next) {
      let isFirstPage = this.currentPage === 1,
        totalSize = this.currentPage * this.pageSize,
        tel = window.$eventBus.loginUserInfo.phone;
      dataServices
        .checkwaitingmsg(tel)
        .then(response => {
          let data = response.data;
          let list;
          if (data.code !== "1") {
            this.$toast.error(data.msg);
            this.dataEmpty = true;
            if (typeof next === "function") {
              next("error");
            }
            return;
          } else {
            list = data.data;
          }
          if (isFirstPage) {
            this.list = list;
            if (list.length === 0) {
              this.dataEmpty = true;
            } else {
              this.dataEmpty = false;
            }
          } else {
            this.list = this.list.concat(...list);
          }
          if (this.list.length < totalSize) {
            this.isListLoadedAll = true;
          } else {
            this.isListLoadedAll = false;
          }

          if (typeof next === "function") {
            next("success");
          }
        })
        .catch(error => {
          if (isFirstPage && error.response && error.response.status === 500) {
            this.dataEmpty = true;
          }
          if (typeof next === "function") {
            next("error");
          }
        });
    },
    jumpDetails(id) {
      this.$router.push({
        name: "details",
        params: {
          id: id
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss">
.search-bar {
  margin: 12px 0 4px;
  height: 40px;
  clear: both;

  .search-bar-input {
    float: left;
    height: 40px;
    width: 80%;
    width: calc(100% - 100px);
  }

  .search-bar-btn {
    float: left;
    height: 40px;
    width: 16%;
    margin-left: 2%;
    width: 80px;
    margin-left: 10px;

    .mu-button {
      min-width: 80px;
    }
  }
}

.empty-info {
  width: 100%;
  text-align: center;
  line-height: 24px;
  font-size: 20px;
  color: #999999;
}

.fix-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  z-index: 1000;
}

.fix-bottom {
  position: fixed;
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.header {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 26px;
  color: #333333;
  background: #fafafa;
}

.main {
  top: 48px;
  overflow: auto;
}
</style>
