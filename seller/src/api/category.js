// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest} from '@/libs/axios';

//获取分类列表数据
export const getCategoryTree = () => {
  return getRequest(`/goods/category/allChildren`)
}
//  添加商品分类
export const insertCategory = (params) => {
  return postRequest('/goods/category', params)
}
//  添加商品分类
export const updateCategory = (params) => {
  return putRequest('/goods/category', params)
}
//删除商品分类
export const delCategory = (id) => {
  return deleteRequest(`/goods/category/${id}`)
}
// 禁用分类
export const disableCategory = (id, type) => {
  return putRequest(`/goods/category/disable/${id}`, type)
}

// 查询某分类下的全部子分类列表
export const getGoodsCategory = (parent_id) => {
  return getRequest(`/goods/category/${parent_id}/all-children`)
}
