const EmployeePage = () => {
  return (
    <div className='inline'>
      <ul className=' space-x-2'>
        {Array.from({ length: 100 }, (_, i) => (
          <li key={i} className='px-2 py-1 bg-gray-200 rounded'>
            Item {i + 1}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default EmployeePage
