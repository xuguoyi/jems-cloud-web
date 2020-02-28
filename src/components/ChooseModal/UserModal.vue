<template>
  <div class="UserModal">
    <div ref="allUser" class="allUser">
      <p>所有人员</p>
      <div class="userContent">
        <div class="searchInput">
          <a-checkbox :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll"></a-checkbox>
          <a-input :value="searchKey" @change="filterValue" ref="userNameInput">
            <a-tooltip slot="suffix">
              <a-icon type="search" v-show="searchKey === ''" style="color: rgba(0,0,0,.45)" />
              <a-icon type="close-circle" v-show="searchKey !== ''" @click="searchKey = ''" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="listContent">
          <a-checkbox-group :options="allUserLists" :value="checkedList" @change="onChange" />
          <ul class="letter-list">
            <li v-for="item in Letters" :key="item" :style="{background: bgLetter === item ? '#1890ff' : '', color: bgLetter === item ? '#fff' : '#000000a6'}" @click="filterLetter(item)">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div ref="operBtn" class="operBtn">
      <a-button type="primary" shape="circle" icon="right" @click="toRight"></a-button>
      <a-button class="centerBtn" type="primary" shape="circle" icon="left" @click="toLeft"></a-button>
      <a-button type="primary" shape="circle" icon="double-left"></a-button>
    </div>
    <div ref="chosedUser" class="chosedUser">
      <p>已选人员</p>
      <div class="userContent">
        <div class="searchInput">
          <a-checkbox :indeterminate="rightIndeterminate" @change="onCheckRightAllChange" :checked="rightCheckAll"></a-checkbox>
        </div>
        <div class="listContent">
          <a-checkbox-group :options="selectUserLists" :value="rightCheckedList" @change="onRightChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const list = [
  { value: '1', label: 'typeA1', type: 'A' },
  { value: '2', label: 'typeA2', type: 'A' },
  { value: '3', label: 'typeB1', type: 'B' },
  { value: '4', label: 'typeB2', type: 'B' },
  { value: '5', label: 'typeB3', type: 'B' }
]
export default {
  name: 'UserModal',
  data () {
    return {
      searchKey: '',
      Letters: ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      bgLetter: 'All',
      checkedList: [],
      indeterminate: false,
      checkAll: false,
      // 右框
      selectUserLists: [],
      rightCheckedList: [],
      rightIndeterminate: false,
      rightCheckAll: false
    }
  },
  computed: {
    allUserLists () {
      const arr = []
      const selArr = []
      const showArr = []
      this.selectUserLists.forEach(item => {
        selArr.push(item.value)
      })
      list.forEach(item => {
        if (!selArr.includes(item.value)) {
          arr.push(item)
        }
      })
      arr.forEach(item => {
        if (this.bgLetter === 'All' || item.type === this.bgLetter) {
          if (~item.label.indexOf(this.searchKey)) {
            showArr.push(item)
          }
        }
      })
      return showArr
    }
  },
  methods: {
    // 左边全选和单选
    onChange (checkedList) {
      this.indeterminate = checkedList.length > 0 && checkedList.length < this.allUserLists.length
      this.checkAll = checkedList.length === this.allUserLists.length
      this.checkedList = checkedList
    },
    onCheckAllChange (e) {
      this.checkedList = e.target.checked ? this.allUserLists.map(item => item.value) : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    },
    // 右边全选和单选
    onRightChange (checkedList) {
      this.rightIndeterminate = checkedList.length > 0 && checkedList.length < this.selectUserLists.length
      this.rightCheckAll = checkedList.length === this.selectUserLists.length
      this.rightCheckedList = checkedList
    },
    onCheckRightAllChange (e) {
      this.rightCheckedList = e.target.checked ? this.selectUserLists.map(item => item.value) : []
      this.rightIndeterminate = false
      this.rightCheckAll = e.target.checked
    },
    filterValue (e) {
      this.searchKey = e.target.value
      this.clearCheck()
    },
    filterLetter (item) {
      this.bgLetter = item
      this.clearCheck()
    },
    clearCheck () {
      this.checkAll = false
      this.checkedList = []
    },
    clearRightCheck () {
      this.rightCheckAll = false
      this.rightCheckedList = []
    },
    // 中部按钮
    toRight () {
      const selArr = []
      this.selectUserLists.forEach(item => {
        selArr.push(item.value)
      })
      const arr = [...new Set([...this.checkedList, ...selArr])]
      const newArr = []
      list.forEach(item => {
        if (arr.includes(item.value)) {
          newArr.push(item)
        }
      })
      this.selectUserLists = newArr
      this.clearCheck()
      this.indeterminate = this.checkedList.length > 0 && this.checkedList.length < this.allUserLists.length
      this.$emit('showName', this.selectUserLists)
    },
    toLeft () {
      const selArr = _.cloneDeep(this.selectUserLists)
      console.log(selArr, 'sel')
      const arr = []
      selArr.forEach(item => {
        if (!this.rightCheckedList.includes(item.value)) {
          arr.push(item)
        }
      })
      this.selectUserLists = arr
      this.clearRightCheck()
      this.rightIndeterminate = this.rightCheckedList.length > 0 && this.rightCheckedList.length < this.selectUserLists.length
      this.$emit('showName', this.selectUserLists)
    },
    clearSelectUserLists () {
      this.selectUserLists = []
      this.$emit('showName', [])
    }
  }
}
</script>

<style lang="less" scoped>
  .UserModal {
    background: #fff;
    display: flex;
    width: 582px;
    height: 580px;
    // padding: 50px;

    .allUser, .chosedUser {
      width:248px;
      .userContent {
        border: 1px solid #e8e8e8;
        border-radius: 4px 4px 0 0;

        .searchInput {
          height: 41px;
          padding: 4px;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
        }
      }
    }

    .operBtn {
      width: 85px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .centerBtn {
        margin: 10px 0;
      }
    }

    .listContent {
      position: relative;
      height: 490px;
      .letter-list {
        list-style-type: none;
        position: absolute;
        right: -15px;
        top: 0;
        font-size: 12px;

        li {
          text-align: center;
          cursor: pointer;
        }
      }
    }
    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
      li {
        cursor: pointer;
      }
    }
    .userlist li {
      padding: 0 5px;
    }
  }

  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }
</style>
