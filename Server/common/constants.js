module.exports = {

  ERROR: {
    1:"데이터베이스 처리도중 오류가 발생했습니다.",
    2:"잘못된 session 입니다.",
    3:"잘못된 parameter 입니다.",
    4:"이미 존재하는 ID 입니다.",
    5:"해당 요청을 처리할 수 없는 계정 입니다.",
    6:"ID 혹은 패스워드가 틀립니다.",
    7:"해당 요청을 처리할 수 없는 그룹 입니다.",
    8:"이미 그룹에 참가한 사용자 입니다.",
    9:"이미 사용자가 가득 찬 그룹입니다.",
    10:"잘못된 email 주소 입니다.",
    11:"패스워드는 영문/숫자 혼용으로 6자 이상만 가능합니다.",
    999:"서버 처리도중 오류가 발생했습니다."
  },
  
  INVITE:{
    CODE_ALPHABETS : "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    CODE_LENGTH : 16
  },

  CONSTRAINTS:{
    OWNER_TYPE : ["MINE","PARTNER","ALL"]
  }

};
