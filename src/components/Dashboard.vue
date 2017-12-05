<template>
    <div id="dashboard">
      <el-row :gutter="20">
        <el-col v-for="(test, index) in testGroup" :xs="24" :sm="12" :md="8" :lg="6" >
          <test-card :index="index"
                     :title="test.title"
                     :module-map="test.moduleMap">
          </test-card>
        </el-col>
      </el-row>
      <el-dialog
        :title = "form.title"
        :visible.sync = "formVisible"
        :close-on-click-modal = true>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="测试名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="测试模块" prop="moduleSelect">
            <el-checkbox-group v-model="form.moduleSelect" @change="checkedModulesChange">
              <el-checkbox v-for="module in moduleName" :label="module" :key="module">{{module}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="panel" v-for="module in form.moduleMap">
            <div class="panel-title">{{module.name}}</div>
            <div class="panel-body">
              <el-form-item label="地址" prop="url">
                <el-input v-model="module.url"></el-input>
              </el-form-item>
            </div>
          </div>
          <el-form-item class="mb-0">
            <el-button class="float-r ml-md" type="primary" @click="onsubmit">确 定</el-button>
            <el-button class="float-r" @click="formVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-button class="add-test-btn" type="primary" @click="createForm"> + </el-button>
    </div>
</template>

<script>
    import TestCard from '@/components/TestCard'
    import EventBus from "@/utils/eventBus"

    const moduleName = ['下载测试', 'ping测试']
    const moduleMap = { download: {
                        name: '下载测试',
                        url: ''
                      },ping: {
                        name: 'ping测试',
                        url: ''
                      }}
    const defaultForm = {
      title: '新增测试',
      moduleSelect: moduleName,
      moduleMap: moduleMap
    }


    //假数据
    const testGroup = [{
      title : '下载测试',
      moduleSelect: moduleName,
      moduleMap: {
        download: {
          name: '下载测试',
          url: 'http://onemttest.onemt.co/downtest.php'
        }, ping: {
          name: 'ping测试',
          url: 'http://onemttest.onemt.co/ping.php'
        }}
    }];

    export default {
      components: { TestCard },
      name: 'Dashboard',
      data () {
        return {
          formVisible: false,
          formIndex: null, //为null表示新建的表单，为数字表示对应编辑的表单下标
          moduleName: moduleName,
          form: {
            title: '新增测试',
            moduleSelect: moduleName,
            moduleMap: moduleMap,
            url: '2222'
          },
          rules: {
            title: [
              { type: 'string', required: true, message: '请输入测试名称', trigger: 'change' },
              { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'change' }
            ],
            moduleSelect: [
              { type: 'array', required: true, message: '请至少选择一个测试模块', trigger: 'blur' }
            ],
            moduleMap: [
              { type: 'string', required: true, message: '测试地址不能为空', trigger: 'blur' }
            ]
          },
          testGroup: testGroup
        }
      },
      methods: {
        checkedModulesChange(val) {
          let curMap ={};
          for (let key in moduleMap) {
            for(let i = 0; i < val.length; i++){
              if(moduleMap[key].name === val[i]) {
                curMap[key] = moduleMap[key];
                break;
              }
            }
          }
          this.form.moduleMap = curMap
        },
        onsubmit() {
          let curForm = JSON.parse(JSON.stringify(this.form));

          if( this.formIndex === null) {
            this.testGroup.push(curForm)
          }else{
            this.testGroup[this.formIndex] = curForm
          }
          this.formVisible = false
        },
        createForm() {
          Object.assign(this.form, defaultForm);

          this.formIndex = null
          this.formVisible = true
        },
        updateForm(index) {
          Object.assign(this.form, this.testGroup[index]);

          this.formIndex = index
          this.formVisible = true
        }
      },
      mounted() {
        EventBus.on('updateTest',(index) => {
          this.updateForm(index)
        })
      }
    }
</script>
<style lang="scss" scoped>
  @import "../styles/variables.scss";

  #dashboard {
    margin: 50px 100px;
    .add-test-btn {
      position: fixed;
      height: 50px;
      width: 50px;
      text-align: center;
      line-height: 50px;
      font-size: 24px;
      border-radius: 50%;
      bottom: 50px;
      right: 50px;
      padding: 0;
      box-shadow: $box-shadow-main;
    }
    .test-card {
      margin: 10px 0;
    }
  }
</style>
