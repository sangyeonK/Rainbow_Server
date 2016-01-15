#요청(Request) 형태

URL Domain :  http://52.68.153.226
HTTP Method : GET, POST

#응답(response) 형태

Header : ContentType=”Application/json;charset=utf-8”

응답데이터는 아래의 (JSON)포맷과 같은 형태로 전달되고, 상세 정보가 요구되는 API의 결과는 result 키위 값에 형태만 변화하게 됩니다.

<응답데이터 기본포맷>

{
    status : 1 ,		//성공 1 , 실패 0
    errorMessage : 		//실패시 발생하는 에러 메세지
    result : { }		//결과 정보
}