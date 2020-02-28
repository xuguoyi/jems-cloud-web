<template>
  <div>
    <a-input
      style="cursor: pointer;"
      placeholder="Basic usage"
      v-model="userNameLabel"
      readonly
      @click="showUserModal">
      <a-icon slot="prefix" type="user" />
    </a-input>
    <a-modal
      title="选择人员"
      :visible="visible"
      width="630px"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button key="back" type="dashed" @click="handleCancel">关闭</a-button>
        <a-button key="back" @click="clearHandle">清空</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确定
        </a-button>
      </template>
      <user-modal ref="userModal" @showName="showName"/>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
// 选人控件
import UserModal from './UserModal'

export default {
  name: 'ShowModal',
  components: {
    UserModal
  },
  data () {
    return {
      // 弹窗
      visible: false,
      confirmLoading: false,
      userNameList: [],
      userNameLabel: ''
    }
  },
  created () {

  },
  methods: {
    showUserModal () {
      this.visible = true
    },
    handleOk () {
      this.visible = false
      this.$emit('showName', this.userNameLabel)
    },
    handleCancel () {
      this.visible = false
    },
    clearHandle () {
      this.visible = false
      this.$refs.userModal.clearSelectUserLists()
    },
    showName (showName) {
      this.userNameList = showName
      this.userNameLabel = showName.map(item => item.label).join(',')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
