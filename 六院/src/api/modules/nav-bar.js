import ajx from '../request.js'
// 获取导航列表
export const getNavBarList = (params) => {
  return ajx.get(`/admin/navbar/export`, {params})
}

// 获取栏目管理列表
export const getColumenList = () => {
  return ajx.get('/admin/navbar/export')
}

// 获取栏目下的子模块
export const getColumenChild = (params) => {
  return ajx.get('/admin/navbar/exportChild', {params})
}

// 删除栏目下的某一个子模块
export const DeleteColumenChild = (id) => {
  return ajx.get(`/admin/navbar/delete/${id}`)
}