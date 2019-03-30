import ajx from '../request.js'
export const getList=(params)=>{
  return ajx.post(`/admin/science/export`,params)
}
export const delList=(params)=>{
  return ajx.get(`/admin/science/unpublish`,{params})
}
export const publish=(params)=>{
  return ajx.get(`/admin/science/publish`,{params})
}
export const del=(params)=>{
  return ajx.get(`/admin/science/delete`,{params})
}
export const newWrite = (params)=>{
  return ajx.post(`/admin/science/save`,params)
}