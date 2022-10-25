<!--suppress CssUnusedSymbol -->
<template>
  <div>
    <!--头部-->
    <worker-header />
    <!--主体-->
    <div style="display: flex">
      <el-container>
        <el-aside width="200px">
          <!--      侧边栏-->
          <worker-aside />
        </el-aside>
        <el-main>
          <!--      内容区域-->
          <router-view style="flex: 1" />
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import workerAside from "@/components/workerAside";
import workerHeader from "@/components/workerHeader";

export default {
  name: "workerLayout",
  components: {
    workerAside,
    workerHeader,
  },
  data() {
    let str = sessionStorage.getItem("user");
    let identity = JSON.parse(str).identity;
    return {
      identity,
    };
  },
};
</script>

<style scoped></style>
