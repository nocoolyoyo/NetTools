<template>

    <div id="dashboard">
      <el-row :gutter="20">
        <el-col :span="6">
          <test-card :title="card1.title" :url="card1.url" :ping-url="card1.pingUrl">

          </test-card>
        </el-col>
        <!--<el-col :span="6">-->
          <!--<test-card>-->

          <!--</test-card>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<test-card>-->

          <!--</test-card>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<test-card>-->

          <!--</test-card>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<test-card>-->

          <!--</test-card>-->
        <!--</el-col>-->
      </el-row>
    </div>
</template>

<script>
    import TestCard from '@/components/TestCard'

    export default {
        components: { TestCard },
        name: 'Dashboard',
        data () {
            return {
                card1: {
                  title : '下载测试',
                  url: 'http://onemttest.onemt.co/downtest.php',
                  pingUrl: 'http://onemttest.onemt.co/ping.php'
                }

            }
        }
    }
</script>
<style scoped>

  .test-card {
    margin: 10px 0;
  }
</style>
