import { axios } from '@/utils/request'

const api = {
  user: '/system/user',
  role: '/system/role',
  permission: '/system/resources',
  dept: '/system/dept',
  dictType: '/system/dict/type',
  dictData: '/system/dict/data',
  dist: '/system/districts',
  config: '/system/config',
  oss: '/system/oss'
}

export default api

// user
export function getUserList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.user + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function saveUser (parameter) {
  const isUpdate = !!parameter.id
  return axios({
    url: api.user + (isUpdate ? `/update/${parameter.id}` : '/insert'),
    method: isUpdate ? 'put' : 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delUser (parameter) {
  return axios({
    url: api.user + `/delete/${parameter.ids}`,
    method: 'delete',
    params: parameter
  })
}
export function changUserStatus (parameter) {
  return axios({
    url: api.user + `/update/status/${parameter.id}/${parameter.status}`,
    method: 'put',
    data: parameter
  })
}
export function resetPwd (parameter) {
  return axios({
    url: api.user + `/update/password/${parameter.id}`,
    method: 'put',
    data: parameter
  })
}

// role
export function getRoleList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.role + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function getRoleAll () {
  return axios({
    url: api.role + '/list',
    method: 'get'
  })
}

export function saveRole (parameter) {
  const isUpdate = !!parameter.id
  return axios({
    url: api.role + (isUpdate ? `/update/${parameter.id}` : '/insert'),
    method: isUpdate ? 'put' : 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delRole (parameter) {
  return axios({
    url: api.role + `/delete/${parameter.ids}`,
    method: 'delete'
  })
}
export function changRoleStatus (parameter) {
  return axios({
    url: api.role + `/update/status/${parameter.id}/${parameter.status}`,
    method: 'put',
    data: parameter
  })
}
export function authDataScope (parameter) {
  return axios({
    url: api.role + '/authDataScope',
    method: 'post',
    data: parameter
  })
}

// menu
export function getPermissionAll (parameter) {
  return axios({
    url: api.permission + '/all',
    method: 'get',
    params: parameter
  })
}
export function getPermissions (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.permission + `/page/1/10`,
    // url: api.permission + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function getRolePermIds (roleId) {
  return axios({
    url: api.permission + '/role/' + `${roleId}`,
    method: 'get'
  })
}

export function savePerm (parameter) {
  return axios({
    url: api.permission + (parameter.menuId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delPerm (deptId) {
  return axios({
    url: api.permission + '/remove/' + `${deptId}`,
    method: 'post'
  })
}

// dept
export function getDeptList (parameter) {
  return axios({
    url: api.dept + '/list',
    method: 'get',
    params: parameter
  })
}
export function getRoleDeptIds (roleId) {
  return axios({
    url: api.dept + '/role/' + `${roleId}`,
    method: 'get'
  })
}
export function saveDept (parameter) {
  return axios({
    url: api.dept + (parameter.deptId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delDept (deptId) {
  return axios({
    url: api.dept + '/remove/' + `${deptId}`,
    method: 'post'
  })
}
// dictType
export function getDictTypeList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.dictType + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function saveDictType (parameter) {
  const isUpdate = !!parameter.id
  return axios({
    url: api.dictType + (isUpdate ? `/update/${parameter.id}` : '/insert'),
    method: isUpdate ? 'put' : 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delDictType (parameter) {
  return axios({
    url: api.dictType + `/delete/${parameter.ids}`,
    method: 'delete',
    params: parameter
  })
}

// dictData
export function getDictDataList (parameter) {
  return axios({
    url: api.dictData + '/list',
    method: 'get',
    params: parameter
  })
}
export function saveDictData (parameter) {
  return axios({
    url: api.dictData + (parameter.dictCode > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delDictData (parameter) {
  return axios({
    url: api.dictData + '/remove',
    method: 'post',
    params: parameter
  })
}
// dist 地区
export function getDistList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.dist + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function saveDist (parameter) {
  const isUpdate = !!parameter.id
  return axios({
    url: api.dist + (isUpdate ? `/update/${parameter.id}` : '/insert'),
    method: isUpdate ? 'put' : 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delDist (parameter) {
  return axios({
    url: api.dist + `/delete/${parameter.ids}`,
    method: 'delete',
    params: parameter
  })
}
// config 配置
export function getConfigList (parameter) {
  const { pageNum, pageSize, ...queryObj } = parameter
  return axios({
    url: api.config + `/page/${pageNum}/${pageSize}`,
    method: 'get',
    params: queryObj
  })
}
export function saveConfig (parameter) {
  const isUpdate = !!parameter.id
  return axios({
    url: api.config + (isUpdate ? `/update/${parameter.id}` : '/insert'),
    method: isUpdate ? 'put' : 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delConfig (parameter) {
  return axios({
    url: api.config + `/delete/${parameter.ids}`,
    method: 'delete',
    params: parameter
  })
}
// oss
export function getOssList (parameter) {
  return axios({
    url: api.oss + '/list',
    method: 'get',
    params: parameter
  })
}
export function saveOss (parameter) {
  return axios({
    url: api.oss + (parameter.id > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function delOss (parameter) {
  return axios({
    url: api.oss + '/remove',
    method: 'post',
    params: parameter
  })
}
export function getOssConfig () {
  return axios({
    url: api.oss + '/config',
    method: 'get'
  })
}
export function saveOssConfig (parameter) {
  return axios({
    url: api.oss + '/saveConfig',
    method: 'post',
    params: parameter
  })
}
