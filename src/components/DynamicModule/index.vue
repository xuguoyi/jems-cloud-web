<template>
  <div class="dynamic-module">
    <div class="CustomTemplate" v-for="(item, index) in formListArr" :Key="index">
      <div class="header">
        <div class="headerTitle">
          <span>{{ index+1 }}.</span>
          <slot name="name"></slot>
        </div>
        <a-popconfirm
          v-if="formList"
          title="Sure to delete?"
          @confirm="() => onDelete(index)"
        >
          <a-icon type="delete" />
        </a-popconfirm>
      </div>
      <div class="body">
        <slot name="content"></slot>
      </div>
    </div>
    <a-button type="primary" icon="plus" @click="handleAdd"></a-button>
  </div>
</template>

<script>
export default {
  name: 'DynamicModule',
  props: {
    formList: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      formListArr: []
    }
  },
  created () {
    this.formListArr.push({ formList: this.formList })
    console.log(this.formListArr, 'formListArr')
  },
  methods: {
    handleAdd () {
      this.formListArr.push({ formList: this.formList })
    },
    onDelete (index) {
      this.formListArr.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.dynamic-module {
  .CustomTemplate {
    border: 1px solid #e8e8e8;
    background: #fff;
    margin-bottom: 15px;
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e8e8e8;
      align-items: center;
      padding: 0 15px;
      .headerTitle {
        display: flex;
      }
    }
    .body {
      padding: 0 15px;
    }
  }
}
</style>
