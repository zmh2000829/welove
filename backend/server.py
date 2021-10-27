from flask import Flask, request, jsonify,make_response
import json, random, string
import pymysql
import sys 
import time
from flask_cors import CORS

user = 'root'
password = ''
database = 'alove'
charset = 'utf8'

app = Flask(__name__)
CORS(app)
@app.route('/')
def hell():
	return 'hello world' 

@app.route('/login',methods=['POST'])
def login():
	nickname = str(json.loads(request.values.get("nickname")))
	passwd = str(json.loads(request.values.get("passwd")))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "select uid,username,gender,num,admin,contact from user where nickname=%s and passwd=%s"
	a = cur.execute(sql, (nickname, passwd))
	if(a == 1):
		temp = cur.fetchall()[0]
		res = {'uid': temp[0], 'username' : temp[1], 'gender': temp[4], 'contact': temp[5], 'num': temp[3], 'admin': temp[4]}
	else:
		res = {}
	conn.commit()
	cur.close()
	conn.close()
	return res

@app.route('/register',methods=['POST'])
def register():
	nickname = str(json.loads(request.values.get("nickname")))
	passwd = str(json.loads(request.values.get("passwd")))
	contact = str(json.loads(request.values.get("contact")))
	gender = str(json.loads(request.values.get("gender")))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "insert into user(nickname,passwd,contact,gender) values(%s,%s,%s,%s)"
	cur.execute(sql, (nickname,passwd,contact,gender))
	res = '成功创建用户'
	conn.commit()
	cur.close()
	conn.close()
	return res

@app.route('/updateInfo',methods=['POST'])
def updateInfo():
	info = json.loads(request.values.get("info"))
	token = str(json.loads(request.values.get("token")))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "update user set username = %s, gender = %s, contact = %s where token=%s"
	cur.execute(sql, (info['username'], info['gender'], info['contact'], token))
	conn.commit()
	cur.close()
	conn.close()
	return 'success'

@app.route('/upload_presentee',methods=['POST'])
def upload_presentee():
	info = json.loads(request.values.get("pinfo"))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "insert into presentee(username,gender,height,age,school,major,details,pic,status,referer) values(%s,%s,%s,%s,%s,%s,%s,%s,0,%s)"
	cur.execute(sql, (info['username'], info['gender'], info['height'], info['age'], info['school'], info['major'], info['details'], info['pic'], info['referer']))
	conn.commit()
	cur.close()
	conn.close()
	return 'success'

@app.route('/upload',methods=['POST'])
def upload():
	img = request.files.get('file')
	print(img)
	path = "C:\\Users\\Lenovo\\Desktop\\wx\\img"
	img_name = img.filename
	file_path = path + img_name
	img.save(file_path)
	return file_path

@app.route('/getrecommends',methods=['POST'])
def getrecommends():
	uid = str(request.values.get("uid"))
	flag = str(request.values.get("flag"))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	if flag == '0':
		sql = "select * from presentee where referer=%s"
	elif flag == '1':
		sql = "select * from presentee where referer!=%s and status = 0"
	elif flag == '2':
		sql = "select * from presentee where referer!=%s and status = 1"

	# 0: 未审核的推荐
	# 1: 审核通过的推荐
	# 2: 审核未通过的推荐

	cur.execute(sql, uid)
	ret = list2dict(list(cur.fetchall()))
	conn.commit()
	cur.close()
	conn.close()
	return {'data': ret}

@app.route('/verify',methods=['POST'])
def verify():
	pid = str(request.values.get("pid"))
	uid = str(request.values.get("uid"))
	flag = str(request.values.get("flag"))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	if flag == '0':
		sql = "update presentee set status = 1 where pid=%s"
		cur.execute(sql, pid)
		conn.commit()
		sql2 = "update user set num = num + 1 where uid=%s"
		cur.execute(sql2, uid)
		conn.commit()
	else:
		sql = "update presentee set status = 2 where pid=%s"
		cur.execute(sql, pid)
		conn.commit()
	cur.close()
	conn.close()
	return 'success'

def list2dict(retlist):
	ret = []
	index = 0
	for item in retlist:
		temp = {}
		temp['id'] = index
		temp['pid'] = item[0]
		temp['username'] = item[1]
		temp['gender'] = item[2]
		temp['gender_txt'] = '男' if item[2] == '1' else '女'
		temp['height'] = item[3]
		temp['age'] = item[4]
		temp['school'] = item[5]
		temp['major'] = item[6]
		temp['details'] = item[7]
		temp['image'] = item[8]
		temp['status'] = item[9]
		temp['referer'] = item[10]
		if item[9] == 0:
			temp['img'] = '../../../image/pending.png'
		elif item[9] == 2:
			temp['img'] = '../../../image/fail.png' 
		else:
			temp['img'] = '../../../image/success.png' 
		ret.append(temp)
		index = index + 1
	return ret

@app.route('/get_referer',methods=['POST'])
def get_referer():
	referer = str(request.values.get("referer"))
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "select username,contact from user where uid=%s"
	cur.execute(sql, referer)
	ret = cur.fetchall()[0]
	conn.commit()
	cur.close()
	conn.close()
	return {'data': ret}



@app.route('/get_score',methods=['POST'])
def get_score():
	stuid = request.values.get("stuid")
	name = request.values.get("name")
	conn = pymysql.connect(host='127.0.0.1', user=user, password=password, database=database, charset=charset)
	cur = conn.cursor()
	sql = "select score_1,score_2 from user where stuid=%s and name=%s"
	cur.execute(sql, (stuid,name))
	temp = cur.fetchall()[0]
	conn.commit()
	score_1 = temp[0]
	score_2 = temp[1]
	cur.close()
	conn.close()
	return {'score_1':score_1,'score_2':score_2}


if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5001, debug = True)
