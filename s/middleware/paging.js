/**
 * Paging middleware
 */
class Paging {

  constructor() {
    this.MAX = 100;
    this.LIMIT = 20;
  }

  /**
   * Paging Parameters
   */
  setPaging() {
    let self = this;

    return (req, res, next) => {

      // limit
      let limit = req.query.limit | 0;
      if (limit <= 0 || self.MAX < limit) {
        limit = this.LIMIT;
      }

      // offset
      let offset = req.query.offset | 0;
      if (offset < 0) {
        offset = 0;
      }

      // set paging
      req._paging = {
        limit:  limit,
        offset: offset, // for ranking
        last:   req.query.last,
        asc:    req.query.asc && req.query.asc !== 'false'
      };
      next();
    }
  }

}

export default new Paging();
