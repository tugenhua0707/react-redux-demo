const {
    BBSLIST_INIT_SUCCESS,
    BBSLIST_INIT_FAIL
} = require('../constants/ActionTypes').default;
const initialState = {
  index: {
    data: null,
    error: null,
    pageNo: 1
  }
}
export default function(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case BBSLIST_INIT_SUCCESS:
      return {
        ... state,
        index: {
          ... state.index,
          // data: action.data
          data: {
            "code": 0,
            "data": {
              "liked": false,  
              "joinCount": 0,  
              "joinList":["","group2/M00/00/AE/wKgBs1eXX_2AKNxWAABWVmkYaBM467.jpg"],
              "topic": {
                "content": "啊啊啊啊啊",  
                "icon": "1",
                "id": 1,          
                "postId": 1,      
                "likedCount": 0,  
                "name": "今天的天气不错啊！",   
                "publishTime": "2016-11-03 14:33:55",
                "replyCount": 0,     
                "status": 1
              },
              "topicOptionList": [
                {
                  "id": 2,
                  "option": "错",
                  "orde": 1,
                  "status": 0,
                  "topicId": 1,
                  "voteCount": 0,
                  "voted":false
                }
              ]
            }
          }
        },
        pageNo: action.pageNo
      }
    case BBSLIST_INIT_FAIL:
      return {
        ... state,
        index: {
          ... state.index,
          error: action.error
        }
      }
    default:
      return state
  }
}
