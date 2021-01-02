from flask import Flask,render_template,request,make_response,redirect,url_for
from subprocess import Popen, PIPE, STDOUT
from werkzeug.utils import secure_filename
import sys
import psycopg2
import os



app = Flask(__name__)
app.secret_key="mahisharma16";  
app.config['UPLOAD_FOLDER']="C:\\flask\\CODENERDS\\static\\img"
conn = psycopg2.connect(database = "codenerdsdb", user = "postgres", password = "mansi_1963", host = "127.0.0.1", port = "5432")
print("connected to database successfully")
cur=conn.cursor()



@app.route('/login',methods=['GET'])
def login():
	if request.method == 'GET':
		if request.cookies.get('username'):
			return redirect(url_for('codenerds'))
		return render_template('login.html', title='login')
	return render_template('login.html', title='login')



@app.route('/wrongPassword',methods=['GET'])
def wrongPassword():
	if request.method == 'GET':
		if request.cookies.get('username'):
			return redirect(url_for('codenerds'))
		return render_template('login.html', title='login',invalid="is-invalid",PWDMessage="Invalid user name of password")
	return render_template('login.html', title='login',invalid="is-invalid",PWDMessage="Invalid user name of password")



@app.route('/register',methods=['GET'])
def register():
	if request.method == 'GET':
		if request.cookies.get('username'):
			return redirect(url_for('codenerds'))
		return render_template('register.html',title='register',isValidEmail='',EVMessage='')



@app.route('/confirm_login',methods=['POST'])
def confirm_login():
	if request.method == 'POST':
		emailId=request.form['inputEmail']
		pwd=request.form['inputPassword']
		cur.execute("select password from cn_users where email_id='"+emailId+"' or username='"+emailId+"'")
		row=cur.fetchall()
		if pwd==row[0][0]:
			resp=make_response(redirect(url_for('codenerds')))
			resp.set_cookie('username',emailId[:-10])
			return resp
		return redirect(url_for('wrongPassword'))
		


@app.route('/confirm_registration',methods=['POST'])
def confirm_registration():
	if request.method == 'POST':
		emailId=request.form['inputEmail']
		f_name=request.form['firstName']
		l_name=request.form['lastName']
		pwd=request.form['inputPassword']
		username=emailId[:-10]
		cur.execute("select email_id from cn_users where username='"+username+"'")
		row=cur.fetchall()
		print(len(row))
		if len(row)>0:
			return render_template('register.html',title='register',isValidEmail='is-invalid',EVMessage='email already registered')
		cur.execute("insert into cn_users (email_id,f_name,l_name,institution,profile_pic,score,password,username,key) values('"+emailId+"','"+f_name+"','"+l_name+"','not_specified','username.jpg','0','"+pwd+"','"+username+"','"+username+"')")
		conn.commit()
		resp=make_response(redirect(url_for('codenerds')))
		resp.set_cookie('username',username)
		return resp



@app.route('/logout')
def logout():
	if request.cookies.get('username'):
		resp=make_response(redirect(url_for('codenerds')))
		resp.set_cookie('username','',expires=0)
		return resp




def getUsersQuesDetails(username):
	cur.execute("select count(*) from algo_ques where ques_id in (select ques_id from algo_solved_ques where username='"+username+"') and level='hard'")
	algo_hard_count=cur.fetchone()
	cur.execute("select count(*) from algo_ques where ques_id in (select ques_id from algo_solved_ques where username='"+username+"') and level='easy'")
	algo_easy_count=cur.fetchone()
	cur.execute("select count(*) from algo_ques where ques_id in (select ques_id from algo_solved_ques where username='"+username+"') and level='medium'")
	algo_medium_count=cur.fetchone()
	cur.execute("select count(*) from ds_ques where ques_id in (select ques_id from ds_solved_ques where username='"+username+"') and level='hard'")
	ds_hard_count=cur.fetchone()
	cur.execute("select count(*) from ds_ques where ques_id in (select ques_id from ds_solved_ques where username='"+username+"') and level='easy'")
	ds_easy_count=cur.fetchone()
	cur.execute("select count(*) from ds_ques where ques_id in (select ques_id from ds_solved_ques where username='"+username+"') and level='medium'")
	ds_medium_count=cur.fetchone()
	cur.execute("select count(*) from  ds_solved_ques where username='"+username+"'")
	ds_count=cur.fetchone()
	cur.execute("select count(*) from  algo_solved_ques where username='"+username+"'")
	algo_count=cur.fetchone()
	total_solved=ds_count[0]+algo_count[0]
	total_solved_actual=ds_count[0]+algo_count[0]
	if(total_solved==0):
		total_solved=1
	return {"score":(algo_hard_count[0]*10)+(algo_medium_count[0]*5)+(algo_easy_count[0]*3)+(ds_hard_count[0]*10)+(ds_medium_count[0]*5)+(ds_easy_count[0]*3),"hard":int(((algo_hard_count[0]+ds_hard_count[0])/total_solved)*100),"easy":int(((algo_easy_count[0]+ds_easy_count[0])/total_solved)*100),"medium":int(((algo_medium_count[0]+ds_medium_count[0])/total_solved)*100),"solved_ques":total_solved_actual}




def getPageDetails(username):
	cur.execute("select f_name,l_name,institution,score,profile_pic from cn_users where username='"+username+"'")
	rows=cur.fetchone()
	quesDetails=getUsersQuesDetails(username)
	print(quesDetails)
	user={"username":username,"fname":rows[0].strip(),"lname":rows[1].strip(),"institution":rows[2].strip(),"profile_pic":rows[4].strip(),"quesDetails":quesDetails}
	print(user)
	cur.execute("select ques_id,question,level,algo_name.name as algo,score from algo_ques inner join algo_name on algo_ques.algo_name=algo_name.code order by algo_ques.question")
	rows=cur.fetchall()
	algo_ques=[]
	for row in rows:
		algo_ques.append({"ques_id":row[0],"question":row[1],"level":row[2],"type":row[3],"score":row[4]})
		cur.execute("select ques_id,question,level,ds_name.name as ds,score from ds_ques inner join ds_name on ds_ques.ds_name=ds_name.code order by ds_ques.question")
		rows=cur.fetchall()
		ds_ques=[]
	for row in rows:
		ds_ques.append({"ques_id":row[0],"question":row[1],"level":row[2],"type":row[3],"score":row[4]})
	ds_algo=[]
	for i in range(0,7):
		ds_algo.append(ds_ques[i])
		ds_algo.append(algo_ques[i])
	return {"ds_algo":ds_algo,"algo_ques":algo_ques,"ds_ques":ds_ques,"user":user}





@app.route('/getListOfUsersAndQuestions',methods=['POST'])
def getListOfUsersAndQuestions():
	if request.method == 'POST':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			cur.execute("select username,profile_pic from cn_users where username!='"+username+"'")
			users=cur.fetchall()
			usersList=[]
			for u in users:
				print(u[0])
				usersList.append({"username":u[0],"profile_pic":u[1]})
			cur.execute("select question,ques_id from ds_ques")
			ques=cur.fetchall()
			quesList=[]
			for q in ques:
				print(q[0])
				quesList.append({"question":q[0],"ques_id":q[1]})
			cur.execute("select question,ques_id from algo_ques")
			ques=cur.fetchall()
			for q in ques:
				print(q[0])
				quesList.append({"question":q[0],"ques_id":q[1]})
			return {"success":True,"response":{"usersList":usersList,"quesList":quesList}}
		return redirect(url_for('login'))
	return redirect(url_for('login'))





@app.route('/getUserInfo',methods=['POST'])
def getUserInfo():
	if request.method == 'POST':
		if request.cookies.get('username'):
			reqData=request.get_json()
			username=reqData.get('username')
			cur.execute("select f_name,l_name,institution,score,profile_pic from cn_users where username='"+username+"'")
			rows=cur.fetchone()
			quesDetails=getUsersQuesDetails(username)
			print(quesDetails)
			user={"username":username,"fname":rows[0].strip(),"lname":rows[1].strip(),"institution":rows[2].strip(),"profile_pic":rows[4].strip(),"quesDetails":quesDetails}
			print(user)
			return {"success":True,"response":user}
		return redirect(url_for('login'))
	return redirect(url_for('login'))





@app.route('/',methods=['GET','POST'])
def codenerds():
	if request.method == 'GET':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			page_details=getPageDetails(username)
			return render_template('index.html',ds_algo=page_details.get('ds_algo'),algo_ques=page_details.get('algo_ques'),ds_ques=page_details.get('ds_ques'),user=page_details.get('user'))
	if request.method == 'POST':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			page_details=getPageDetails(username)
			return render_template('index.html',ds_algo=page_details.get('ds_algo'),algo_ques=page_details.get('algo_ques'),ds_ques=page_details.get('ds_ques'),user=page_details.get('user'))
		return redirect(url_for('login'))
	return redirect(url_for('login'))





@app.route('/getQuestion',methods=['POST'])
def get_question():
	if request.method == 'POST':
		if request.cookies.get('username'):
			req_data=request.get_json()
			print(req_data)
			username=request.cookies.get('username')
			ques_id=req_data.get('ques_id')
			if ques_id[:2]=='aq':
				solved_ques_table='algo_solved_ques'
			else:
				solved_ques_table='ds_solved_ques'
			f=open(os.path.join("c:\\","flask","CODENERDS","db","questions",req_data.get("ques_id")+".txt"),'r')
			cur.execute("select success from "+solved_ques_table+" where ques_id='"+ques_id+"' and username='"+username+"'")
			row=cur.fetchall()
			if not  row:
				return {"success":True,"response":{"question":f.read(),"code":"#include<stdio.h>\r\nint main()\r\n{\r\n\r\\\\write your code here...\r\nreturn 0;\r\n}"}}
			fc=open(os.path.join("c:\\","flask","CODENERDS","db","solved_ques",username+req_data.get("ques_id")+".txt"),'r')
			return {"success":True,"response":{"question":f.read(),"code":fc.read()}}
	return redirect(url_for('login'))





@app.route('/compileAndTest',methods=['POST'])
def compile_and_test():
	if request.method == 'POST':
		if request.cookies.get('username'):
			req_data=request.get_json()
			print(req_data)
			username=request.cookies.get('username')
			ques_id=req_data.get('ques_id')
			code=req_data.get('code')
			language=req_data.get('language')
			if ques_id[:2]=='aq':
				solved_ques_table='algo_solved_ques'
			else:
				solved_ques_table='ds_solved_ques'
			cur.execute("select success from "+solved_ques_table+" where ques_id='"+ques_id+"' and username='"+username+"'")
			row=cur.fetchall()
			if not  row:
				cur.execute("insert into "+solved_ques_table+"(ques_id,username,success) values('"+ques_id+"','"+username+"',FALSE)")
				conn.commit()
			store_file=open(os.path.join("c:\\","flask","CODENERDS","db","solved_ques",username+ques_id+".txt"),'w')
			store_file.write(code)
			store_file.close()
			input_file=open(os.path.join("c:\\","flask","CODENERDS","db","testcases","sample_input"+req_data.get("ques_id")+".txt"),'rb')
			if language=='C':
				f = open('ques.c', 'w')
				f.write(code)
				f.close()
				cmd='gcc ques.c -o ques.exe'
				p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
				err=str(p.stderr.read())
				if len(err)>3:
					err=str(err)
					err=err[2:]
					err=err[:-1]
					err=err.replace('\\r\\n','<br>');
					err=err.replace('\\n','<br>');
					err=err.replace('\\r','');
					err=err.replace('\\','');
					err=err.replace('ques.c:','');
					return {"success":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Compilation Error: </div></div><br><br>"+ err+"</h6>"}
				else:
					cmd='ques'
					p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
					err=str(p.stderr.read())
					output=str(p.stdout.read())
					real_output=output
					output=output[2:]
					output=output[:-1]
					output=output.replace('\\r','')
					output=output.replace('\\r\\n','<br>')
					output=output.replace('\\n','<br>')
					output_file=open(os.path.join("c:\\","flask","CODENERDS","db","outputs","sample_output"+req_data.get("ques_id")+".txt"),'rb')
					sample_output=str(output_file.read())
					output_file.close()
					sample_output=sample_output[2:]
					sample_output=sample_output[:-1]+"\\r\\n"
					sample_output=sample_output.replace('\\r','')
					sample_output=sample_output.replace('\\r\\n','<br>')
					sample_output=sample_output.replace('\\n','<br>')
					sample_input=str(input_file.read())
					input_file.close()
					sample_input=sample_input[2:]
					sample_input=sample_input[:-1]
					sample_input=sample_input.replace('\\r','')
					sample_input=sample_input.replace('\\r\\n','<br>')
					sample_input=sample_input.replace('\\n','<br>')
					print(sample_output)
					print(output)
					if output==sample_output:
						return {"success":True,"response":"<h6><div class='card bg-success text-white shadow'><div class='card-body'>Sample Testcases Passed</div></div><br><br><b>For Input: </b><br>"+sample_input+"<br><br><b>Expected Output: </b> <br>"+sample_output+"<br><br><b>Your Ouput: <br></b>"+output+"</h6>"}
					return {"success":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Sample Testcases Failed</div></div><br><br><b>For Input: </b><br>"+sample_input+"<br><br><b>Expected Output: </b><br> "+sample_output+"<br><br><b>Your Ouput: <br></b>"+output+"</h6>"}
			else:
				if language=='CPP':
					f = open('ques1.cpp', 'w')
					f.write(code)
					f.close()
					cmd='g++ ques1.cpp -o ques1.exe'
					p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
					err=str(p.stderr.read())
					if len(err)>3:
						err=str(err)
						err=err[2:]
						err=err[:-1]
						err=err.replace('\\r\\n','<br>');
						err=err.replace('\\n','<br>');
						err=err.replace('\\r','');
						err=err.replace('\\','');
						err=err.replace('ques1.cpp:','');
						return {"success":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Compilation Error: </div></div><br><br>"+ err+"</h6>"}
					else:
						cmd='ques1'
						p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
						err=str(p.stderr.read())
						output=str(p.stdout.read())
						real_output=output
						output=output[2:]
						output=output[:-1]
						output=output.replace('\\r','')
						output=output.replace('\\r\\n','<br>')
						output=output.replace('\\n','<br>')
						output_file=open(os.path.join("c:\\","flask","CODENERDS","db","outputs","sample_output"+req_data.get("ques_id")+".txt"),'rb')
						sample_output=str(output_file.read())
						output_file.close()
						sample_output=sample_output[2:]
						sample_output=sample_output[:-1]+"\\r\\n"
						sample_output=sample_output.replace('\\r','')
						sample_output=sample_output.replace('\\r\\n','<br>')
						sample_output=sample_output.replace('\\n','<br>')
						sample_input=str(input_file.read())
						input_file.close()
						sample_input=sample_input[2:]
						sample_input=sample_input[:-1]
						sample_input=sample_input.replace('\\r','')
						sample_input=sample_input.replace('\\r\\n','<br>')
						sample_input=sample_input.replace('\\n','<br>')
						print(sample_output)
						print(output)
						if output==sample_output:
							return {"success":True,"response":"<h6><div class='card bg-success text-white shadow'><div class='card-body'>Sample Testcases Passed</div></div><br><br><b>For Input: </b><br>"+sample_input+"<br><br><b>Expected Output: </b> <br>"+sample_output+"<br><br><b>Your Ouput: <br></b>"+output+"</h6>"}
						return {"success":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Sample Testcases Failed</div></div><br><br><b>For Input: </b><br>"+sample_input+"<br><br><b>Expected Output: </b><br> "+sample_output+"<br><br><b>Your Ouput: <br></b>"+output+"</h6>"}
		return redirect(url_for('login'))






@app.route('/submit',methods=['POST'])
def submit():
	if request.method == 'POST':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			req_data=request.get_json()
			ques_id=req_data.get("ques_id")
			print(req_data)
			code=req_data.get('code')
			language=req_data.get('language')
			input_file=open(os.path.join("c:\\","flask","CODENERDS","db","testcases","input"+ques_id+".txt"),'rb')
			if language=='C':
				f = open('ques.c', 'w')
				f.write(code)
				f.close()

				cmd='gcc ques.c -o ques.exe'
				p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
				err=str(p.stderr.read())
				if len(err)>3:
					err=str(err)
					err=err[2:]
					err=err[:-1]
					err=err.replace('\\r\\n','<br>');
					err=err.replace('\\n','<br>');
					err=err.replace('\\r','');
					err=err.replace('\\','');
					err=err.replace('ques.c:','');
					return {"success":True,"response":{"error":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Compilation Error: </div></div><br>"+ err+"</h6>"}}
				else:
					cmd='ques'
					p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
					err=str(p.stderr.read())
					output=str(p.stdout.read())
					input_file.close()
					real_output=output
					output=output[2:]
					output=output[:-1]
					output_file=open(os.path.join("c:\\","flask","CODENERDS","db","outputs","output"+ques_id+".txt"),'rb')
					sample_output=str(output_file.read())
					output_file.close()
					sample_output=sample_output[2:]
					sample_output=sample_output[:-1]+"\\r\\n"
					if ques_id[:2]=='aq':
						table='algo_ques'
						solved_ques_table='algo_solved_ques'
						ques_table='algo_ques'
					else:
						table='ds_ques'
						solved_ques_table='ds_solved_ques'
						ques_table='ds_ques'
					cur.execute("select no_output_line from "+table+" where ques_id='"+ques_id+"'")
					no_output=cur.fetchone()
					real_output=list(sample_output.split("\\r\\n"))
					users_output=list(output.split("\\r\\n"))
					resp_arr=[]
					ro_len=len(real_output)
					uo_len=len(users_output)
					is_failed=False
					for i in range(0,5):
						resp_arr.append(True)
						k=i*no_output[0]
						for j in range(k,no_output[0]+k):
							if j>=ro_len or j>=uo_len:
								resp_arr[i]=False
								is_failed=True
								break
							if str(real_output[j]) != str(users_output[j]):
								resp_arr[i]=False
								is_failed=True
								break
							print(real_output[j]+","+users_output[j])
					cur.execute("select success from "+solved_ques_table+" where ques_id='"+ques_id+"' and username='"+username+"'")
					row=cur.fetchall()
					if not  row:
						if not is_failed:
							cur.execute("select score from "+ques_table+" where ques_id='"+ques_id+"'")
							row=cur.fetchone()
							std_score=row[0]
							cur.execute("select score from "+table+" where username='"+username+"'")
							row=cur.fetchone()
							total_score=std_score+row[0]
							cur.execute("update "+table+" set score='"+total_score+"' where username='"+username+"'")
							cur.execute("insert into "+solved_ques_table+"(ques_id,username,success) values('"+ques_id+"','"+username+"',TRUE)")
							conn.commit()
						else:
							cur.execute("insert into "+solved_ques_table+"(ques_id,username,success) values('"+ques_id+"','"+username+"',FALSE)")
							conn.commit()
					else:
						if row[0]==False:
							if not is_failed:
								cur.execute("select score from "+ques_table+" where ques_id='"+ques_id+"'")
								row=cur.fetchone()
								std_score=row[0]
								cur.execute("select score from "+table+" where username='"+username+"'")
								row=cur.fetchone()
								total_score=std_score+row[0]
								cur.execute("update "+table+" set score='"+total_score+"' where username='"+username+"'")
								cur.execute("update "+solved_ques_table+" set success=TRUE where ques_id='"+ques_id+"' and username='"+username+"'")
								conn.commit()
					store_file=open(os.path.join("c:\\","flask","CODENERDS","db","solved_ques",username+ques_id+".txt"),'w')
					store_file.write(code)
					store_file.close()
					print(resp_arr)
					print(no_output[0])
					print(real_output)
					print(users_output)
					return {"success":True,"response":{"error":False,"response":resp_arr}}
			else:
				if language=='CPP':
					f = open('ques1.cpp', 'w')
					f.write(code)
					f.close()
					cmd='g++ ques1.cpp -o ques1.exe'
					p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
					err=str(p.stderr.read())
					if len(err)>3:
						err=str(err)
						err=err[2:]
						err=err[:-1]
						err=err.replace('\\r\\n','<br>');
						err=err.replace('\\n','<br>');
						err=err.replace('\\r','');
						err=err.replace('\\','');
						err=err.replace('ques1.cpp:','');
						return {"success":True,"response":{"error":True,"response":"<h6><div class='card bg-danger text-white shadow'><div class='card-body'>Compilation Error: </div></div><br>"+ err+"</h6>"}}
					else:
						cmd='ques1'
						p=Popen(cmd,shell=True,stdin=input_file.fileno(),stdout=PIPE,stderr=PIPE,close_fds=True)
						err=str(p.stderr.read())
						output=str(p.stdout.read())
						input_file.close()
						real_output=output
						output=output[2:]
						output=output[:-1]
						output_file=open(os.path.join("c:\\","flask","CODENERDS","db","outputs","output"+req_data.get("ques_id")+".txt"),'rb')
						sample_output=str(output_file.read())
						output_file.close()
						sample_output=sample_output[2:]
						sample_output=sample_output[:-1]+"\\r\\n"
						if req_data.get('ques_id')[:2]=='aq':
							table='algo_ques'
							solved_ques_table='algo_solved_ques'
							ques_table='algo_ques'
						else:
							table='ds_ques'
							solved_ques_table='ds_solved_ques'
							ques_table='ds_ques'
						cur.execute("select no_output_line from "+table+" where ques_id='"+ques_id+"'")
						no_output=cur.fetchone()
						real_output=list(sample_output.split("\\r\\n"))
						users_output=list(output.split("\\r\\n"))
						resp_arr=[]
						ro_len=len(real_output)
						uo_len=len(users_output)
						is_failed=False
						for i in range(0,5):
							resp_arr.append(True)
							k=i*no_output[0]
							for j in range(k,no_output[0]+k):
								if j>=ro_len or j>=uo_len:
									resp_arr[i]=False
									is_failed=True
									break
								if str(real_output[j]) != str(users_output[j]):
									resp_arr[i]=False
									is_failed=True
									break
						cur.execute("select success from "+solved_ques_table+" where ques_id='"+ques_id+"' and username='"+username+"'")
						row=cur.fetchall()
						if not  row:
							if not is_failed:
								cur.execute("select score from "+ques_table+" where ques_id='"+ques_id+"'")
								row=cur.fetchone()
								std_score=row[0]
								cur.execute("select score from "+table+" where username='"+username+"'")
								row=cur.fetchone()
								total_score=std_score+row[0]
								cur.execute("update "+table+" set score='"+total_score+"' where username='"+username+"'")
								cur.execute("insert into "+solved_ques_table+"(ques_id,username,success) values('"+ques_id+"','"+username+"',TRUE)")
								cur.commit()
							else:
								cur.execute("insert into "+solved_ques_table+"(ques_id,username,success) values('"+ques_id+"','"+username+"',FALSE)")
								conn.commit()
						else:
							if row[0]==False:
								if not is_failed:
									cur.execute("select score from "+ques_table+" where ques_id='"+ques_id+"'")
									row=cur.fetchone()
									std_score=row[0]
									cur.execute("select score from "+table+" where username='"+username+"'")
									row=cur.fetchone()
									total_score=std_score+row[0]
									cur.execute("update "+table+" set score='"+total_score+"' where username='"+username+"'")
									cur.execute("update "+solved_ques_table+" set success=TRUE where ques_id='"+ques_id+"' and username='"+username+"'")
									conn.commit()
						store_file=open(os.path.join("c:\\","flask","CODENERDS","db","solved_ques",username+ques_id+".txt"),'w')
						store_file.write(code)
						store_file.close()
						print(resp_arr)
						print(no_output[0])
						print(real_output)
						print(users_output)
						return {"success":True,"response":{"error":False,"response":resp_arr}}
		return redirect(url_for('login'))






@app.route('/profile',methods=['GET'])
def getProfile():
	if request.method == 'GET':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			page_details=getPageDetails(username)
			return render_template('userprofile.html',ds_algo=page_details.get('ds_algo'),algo_ques=page_details.get('algo_ques'),ds_ques=page_details.get('ds_ques'),user=page_details.get('user'))
	if request.method == 'POST':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			page_details=getPageDetails(username)
			return render_template('userprofile.html',ds_algo=page_details.get('ds_algo'),algo_ques=page_details.get('algo_ques'),ds_ques=page_details.get('ds_ques'),user=page_details.get('user'))
		return redirect(url_for('login'))
	return redirect(url_for('login'))






@app.route('/updateProfile',methods=['POST'])
def update_profile():
	if request.method == 'POST':
		if request.cookies.get('username'):
			username=request.cookies.get('username')
			fname=request.form['fname']
			lname=request.form['lname']
			institution=request.form['institution']
			f=request.files['profile_pic']
			f.save(os.path.join(app.config['UPLOAD_FOLDER'],secure_filename(f.filename)))
			cur.execute("update cn_users set f_name='"+fname+"',l_name='"+lname+"',institution='"+institution+"',profile_pic='"+secure_filename(f.filename)+"' where username='"+username+"'")
			conn.commit()
			print(fname+" "+lname+" "+institution+" "+f.filename)
			return redirect(url_for('getProfile'))	
		return redirect(url_for('login'))
	return redirect(url_for('login'))
	




if __name__ == '__main__':
	app.run(debug=True)
    