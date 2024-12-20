

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className='bg-white rounded'>
      <input
        type='text'
        placeholder='Search...'
        className='border border-gray-light p-2 rounded w-full'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
