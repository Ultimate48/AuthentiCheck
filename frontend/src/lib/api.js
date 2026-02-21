import axios from 'axios'

const api = axios.create({
  baseURL: 'https://authenticheck-yaqi.onrender.com',
})

export const createBatch = (payload) => api.post('/batch', payload)
export const verifyBatch = (batchId) => api.post('/verify', { batchId })
export const createSupplyMember = (payload) => api.post('/supply-member', payload)
export const getSupplyMembers = () => api.get('/supply-members')
export const updateSupplyMemberStatus = (id, status) => api.patch(`/supply-member/${id}/status`, { status })

export default api
