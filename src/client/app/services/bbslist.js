import * as requestService from './request';
import * as config from '../../../etc/config';
export const req = {

  /*
   * 帖子管理页面
   */
  index: function(params, header, filterStateFlag, filterJSONFlag, filterCodeFlag) {
    return requestService.commonGet(config.api.bbsIndex, header, filterStateFlag, filterJSONFlag, filterCodeFlag);
  }
}