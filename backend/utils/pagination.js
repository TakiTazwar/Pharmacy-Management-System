const paginationSkip = (page,items) => {
    return {skipMed: (page-1)*items}
}

module.exports = paginationSkip;