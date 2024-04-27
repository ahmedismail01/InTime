module.exports = paginate = (itemsPerPage, page, items) => {
  const start = page == 1 ? 0 : page * itemsPerPage - itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = items.slice(start, end);
  const previousPage = items[start - 1] ? true : false;
  const nextPage = items[end] ? true : false;
  return { paginatedItems, previousPage, nextPage };
};
