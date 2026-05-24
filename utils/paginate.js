module.exports = paginationResponse = (itemsPerPage, page, items, total) => {
  const pages = Math.ceil(total / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;

  const previousPage = page > 1;
  const nextPage = page < pages;
  return { previousPage, nextPage };
};
