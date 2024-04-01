// 2 3

// 2 * 2 4 -2 
module.exports = paginate = (itemsPerPage, page, items) => {
  const start = (page == 1) ? 0 : (page * itemsPerPage) - itemsPerPage;
  const end = start + itemsPerPage;
  console.log( items)
  const paginatedItems = items.slice(start, end)
  const previousPage = items[start - 1] ? true : false
  const nextPage =  items[end + 1] ? true : false
  return {paginatedItems , previousPage , nextPage}
};


