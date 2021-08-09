import { useState, useEffect } from 'react'
import { Form, InputGroup, Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Collection } from '../../domain/models/collection'
import { ProductCollectionItem } from '../../domain/models/product.model'
import repo from '../../data/repositories/product.repository'

function ProductList() {
  const [productCollection, setProductCollection] = useState<Collection<ProductCollectionItem>>()
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const currentPageInSessionStorage = sessionStorage.getItem('current_page') || '1'
    return Number.parseInt(currentPageInSessionStorage)
  })
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if(loading) return
    
    (async () => {
      await repo.getProducts(currentPage).then((response) => {
        setLoading(true)
        setProductCollection(response)
        setCurrentPage(response.currentPage)
        sessionStorage.setItem('current_page', response.currentPage.toString())
        setTotalPages(response.totalPages)
        setLoading(false)
      })
    })()
  }, [currentPage])

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Listagem de produtos</h1>

      <div className="card shadow mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%">
              <thead className="card-header py-3">
                <tr>
                  <th style={{ width: '120px' }}>ID</th>
                  <th>Nome</th>
                  <th style={{ width: '200px' }}>Preço</th>
                  <th style={{ width: '200px' }}>Quantidade</th>
                </tr>
                <tr>
                  <th className='py-1'>
                    <Form.Control size='sm' />
                  </th>
                  <th className='py-1'>
                    <Form.Control size='sm' />
                  </th>
                  <th className='py-1'>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <Form.Control as='select' size='sm'>
                          {
                            ['=', '<>', '>', '>=', '<', '<='].map((item, index) => (
                              <option value={item} key={index}>{item}</option>
                            ))
                          }
                        </Form.Control>
                      </InputGroup.Prepend>
                      <Form.Control size='sm' />
                    </InputGroup>
                  </th>
                  <th className='py-1'>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <Form.Control as='select' size='sm'>
                          {
                            ['=', '<>', '>', '>=', '<', '<='].map((item, index) => (
                              <option value={item} key={index}>{item}</option>
                            ))
                          }
                        </Form.Control>
                      </InputGroup.Prepend>
                      <Form.Control size='sm' />
                    </InputGroup>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productCollection && (
                  productCollection.data.map(product => (
                    <tr>
                      <td>{product.id}</td>
                      <td><Link to={`products/${product.id}`}>{product.name}</Link></td>
                      <td>R$ {product.price.toFixed(2)}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}>
                    <Pagination style={{margin: 0, justifyContent:'center'}}>
                      <Pagination.First onClick={() => setCurrentPage(1)} />
                      <Pagination.Prev onClick={() => {
                          const previousPage = currentPage === 1 ? 1 : currentPage - 1
                          setCurrentPage(previousPage)
                        }} 
                      />
                      {Array(totalPages).fill('').map((_, index) => {
                        return ((index + 1) >= (currentPage - 2)) && ((index + 1) <= (currentPage + 2)) ?
                          <Pagination.Item onClick={() => setCurrentPage(index + 1)}>{index + 1}</Pagination.Item> :
                          null
                      })}
                      <Pagination.Next onClick={() => {
                          const nextPage = currentPage === totalPages ? totalPages : currentPage + 1
                          setCurrentPage(nextPage)
                        }}
                      />
                      <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                    </Pagination>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
