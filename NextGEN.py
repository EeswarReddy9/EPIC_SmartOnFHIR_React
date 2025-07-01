from flask import Flask, json, render_template, request, jsonify, redirect, session,send_from_directory
from flask_cors import CORS
from urllib.parse import urlencode,urlparse, parse_qs
import requests
import secrets
import jwt
import os
import pyodbc
from datetime import datetime,date
import pytz
import ast
from concurrent.futures import ThreadPoolExecutor, as_completed

email_app = Flask(__name__)
email_app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'   # or 'None' if cross-site
email_app.config['SESSION_COOKIE_SECURE'] = False     # True if over HTTPS
email_app.secret_key = secrets.token_hex(16)

grant_type = 'client_credentials'
token_type = 'Bearer'
client_id = '997267a9-f1b9-4871-bd23-b6e91eb11524'
client_secret = '943258f9-7783-49d0-aa51-14bec7d968fe'
site_id = '2e2b3c58-7d5c-8c4d-8d6f-be9be891085a'
tokenEndPoint = 'https://nativeapi.nextgen.com/nge/prod/nge-oauth/token'
baseurl = 'https://nativeapi.nextgen.com/nge/prod/nge-api/api'
x_ng_sessionid = 'MDAwMDF8MDAwMXwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMHwwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMHx8NDU2MzQ='

email_app.secret_key = 'advnugdsfcnuSGDUFDH0rgfnvwhurf'

CORS(email_app, supports_credentials=True, resources={
    r"/api/*": {"origins": "http://localhost:5000"}
})

conn = pyodbc.connect(
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=LAPTOP-OOV6F26T;'
    'DATABASE=Smart_On_FHIR;'
    'Trusted_Connection=yes;'
)

cursor = conn.cursor()
access_token=None
token_type=None

@email_app.route("/")
def home():  
    return redirect("/getAccesstoken")

@email_app.route("/getAccesstoken")
def get_auth_url():    
    token_data = {
        'grant_type': grant_type,
        'client_id': client_id,
        'client_secret':client_secret,
        'site_id':site_id
        }
    token_headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }
        
    try:
        response = requests.post(
            tokenEndPoint,  # Corrected variable name
            data=urlencode(token_data),
            headers=token_headers
        )
        response.raise_for_status()
        token_response = response.json()

        global access_token, token_type
        access_token = token_response.get('access_token')
        session['access_token']=access_token
        token_type = token_response.get('token_type')
        # return render_template('callback.html')
        return redirect("http://localhost:5000?authenticated=true")

    except requests.exceptions.RequestException as e:
        print(f"Token request failed: {e}")
        return redirect('/getAuthUrl')


@email_app.route('/api/practitioner data', methods=['GET'])
def practitioner_details():
    access_token = session.get('access_token')
    token_type = session.get('token_type')
    
    decoded_jwt = jwt.decode(access_token, options={"verify_signature": False})
    practitioner_id=decoded_jwt['sub']
    headers = {
        "Authorization": f"{token_type} {access_token}",
        "accept": "application/fhir+json"
    }

    response = requests.get(f"{baseurl}/Practitioner/{practitioner_id}", headers=headers)

    if response.status_code == 200:
        try:
            Clinician_Data = response.json()
            practitioner_id=Clinician_Data['id']
            practitioner_name = Clinician_Data['name'][0]['text']
            practitioner_user_name = Clinician_Data['identifier'][0]['value']
            practitioner_active_status=Clinician_Data['active']
            Json_Clinician_Data={'Practitioner_Id':practitioner_id,
                            'Practitioner_Name':practitioner_name,
                            'Practitioner_User_Name':practitioner_user_name,
                            'Active_Status':practitioner_active_status,
               }
            return json.dumps(Json_Clinician_Data)
        except requests.JSONDecodeError:
            print("Response is not in JSON format, trying to parse as XML")
    else:
        print(f"Failed to retrieve data: {response.status_code} - {response.text}")


@email_app.route('/api/patients')
def get_patients():
    access_token = session.get('access_token')    

    if not access_token:
        return redirect("http://localhost:5000")

    headers = {
        "Authorization": f"{token_type} {access_token}", 
        "x-ng-sessionid": x_ng_sessionid
    }

    response = requests.get(f"{baseurl}/persons", headers=headers)
    persons_response = response.json()
    person_ids = [item['personId'] for item in persons_response['items']]
    print(f'\n\n\n person ID {person_ids}')

    person_info = []

    def fetch_demographics(person_id):
        try:
            response = requests.get(f"{baseurl}/persons/{person_id}", headers=headers)
            if response.status_code == 200:
                demographic_response = response.json()
                return {
                    'id': demographic_response['id'],
                    'name': demographic_response['firstName'] + ' ' + demographic_response['lastName'],
                    'gender': 'Female' if demographic_response['sex'] == 'F' else 'Male'
                }
        except Exception as e:
            print(f"Error fetching person {person_id}: {e}")
        return None

    with ThreadPoolExecutor(max_workers=10) as executor:  # Tune this number based on your system/network
        futures = [executor.submit(fetch_demographics, pid) for pid in person_ids]
        for future in as_completed(futures):
            result = future.result()
            if result:
                person_info.append(result)
                print(f'demographic_response {result}\n\n\n')

    return jsonify(person_info)


@email_app.route('/api/patient_data/<patient_id>')
def get_patient_data(patient_id):
    access_token = session.get('access_token')
    if not access_token:
        return redirect("http://localhost:5000")
    else:
        cursor.execute("EXEC member_profile ?", (patient_id,))
        members = cursor.fetchall()
        member_information={"DemoGraphic":{
                                            "Member_ID":members[0][0],
                                            "Name":members[0][1],
                                            "DOB":members[0][4],
                                            "Gender":members[0][36],
                                            "TIN":members[0][6],
                                            "NPI":members[0][8] 
                                            },
                            "RafScore":{
                                            "RAFScore":members[0][16],
                                            "PrevRAFScore":members[0][17],
                                            "ScoreGAP":members[0][18]
                                        },
                            "AWVSection":{    
                                            "AWV_Due_Date":members[0][14].strftime('%m-%d-%Y') if isinstance(members[0][14], datetime) else members[0][14],
                                            "AWV_Code":members[0][15],
                                        },
                            "OtherInformation":{
                                            "High_Cost":members[0][13],
                                            "Spec_Cost":members[0][13],
                                            "Medications_Cnt":members[0][19],
                                            "RPM_Eligible":members[0][37],
                                            },
                            "ER_Visits":{
                                        "ER_Visits_12":members[0][9],
                                        "ER_Visits_3":members[0][10]
                                        },
                            "IP_Visits":{
                                        "IP_Visits_12":members[0][11],
                                        "IP_Visits_3":members[0][12] 
                                        },
                            "IP_Cost": {
                                        "IPcost_0": str(members[0][20]),
                                        "IPcost_1": str(members[0][21]),
                                        "IPcost_2": str(members[0][22]),
                                        "IPcost_3": str(members[0][23])
                                    },
                            "ER_Costs": {
                                "ERcost_0": str(members[0][24]),
                                "ERcost_1": str(members[0][25]),
                                "ERcost_2": str(members[0][26]),
                                "ERcost_3": str(members[0][27])
                            },
                            "Other_Costs": {
                                "OTcost_0": str(members[0][28]),
                                "OTcost_1": str(members[0][29]),
                                "OTcost_2": str(members[0][30]),
                                "OTcost_3": str(members[0][31])
                            },
                            "Total_Costs": {
                                "Totalcost_0": str(members[0][32]),
                                "Totalcost_1": str(members[0][33]),
                                "Totalcost_2": str(members[0][34]),
                                "Totalcost_3": str(members[0][35])
                            }
                            }
        
        critical_items=[]
        awv_due_date = members[0][14].date()  # Convert datetime to date
        today = date.today()
        print(f'AWV Due Date: {awv_due_date}')
        if today < awv_due_date:
            critical_items.append(f'Annual Wellness Visit due by {awv_due_date} ({members[0][15]})')
            print(f'\n\n\nAWV Due Date {awv_due_date}')

        if members[0][16]>members[0][17]:
            critical_items.append(f'RAF Score Gap: {members[0][18]} (Current: {members[0][16]}, Previous: {members[0][17]})')

        if members[0][37]!='YES':
            critical_items.append(f'Remote Patient Monitoring Is Not Eligible')

        quality_measure_information = []
        hcc_information = []

        for member in members:
            measure_info = {
                "measure_name": member[48],
                "measure_value": member[50]
            }
            if measure_info not in quality_measure_information:
                quality_measure_information.append(measure_info)
                
            hcc_info = {
                "HCCCODE": member[38],
                "HCCDescription": member[39],
                "DgnsCD": member[42],
                "DiagnosisDescription": member[43],
                "Diag_PY": member[44],
                "Diag_CY": member[45]
            }
            if hcc_info not in hcc_information:
                hcc_information.append(hcc_info)

        member_information['Quality_Measure']=quality_measure_information
        member_information['Diagnosis']=hcc_information
        member_information['Critical_Items']=critical_items

        return jsonify({"Member Info": member_information})


def validate_awv_date(date_str):
    access_token = session.get('access_token')
    if not access_token:
        return redirect("http://localhost:5000")
    else:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            today = datetime.now(pytz.utc).date()

            return date
        except ValueError:
            return False, "Invalid date format. Use YYYY-MM-DD"



@email_app.route('/api/update-awv-date', methods=['POST'])
def update_awv_date():
    access_token = session.get('access_token')
    if not access_token:
        return redirect("http://localhost:5000")

    try:
        data = request.get_json()
        member_id = data.get('memberId')
        new_awv_date = data.get('newAWVDate')

        if not member_id or not new_awv_date:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        date_validation = validate_awv_date(new_awv_date)

        cursor.execute("""
            UPDATE [Smart_On_FHIR].[dbo].[Member_Details]
            SET AWV_Due_Date = ?
            WHERE MemberID = ?
        """, (date_validation, member_id))

        conn.commit()

        return jsonify({
            'success': True,
            'message': 'AWV date updated successfully',
        })

    except Exception as e:
        print(f"Error in update_awv_date: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500



@email_app.route('/api/update-measure', methods=['POST'])
def update_measure():
    access_token = session.get('access_token')
    if not access_token:
        return redirect("http://localhost:5000")
    else:
        try:
            data = request.json
            print("Received updated measure data:", data)

            # Extract fields from JSON
            measure_name = data.get('measure_name')
            measure_value = data.get('measure_value')
            note = data.get('note')
            member_id = data.get('member_Id')

            if not all([measure_name, measure_value, member_id]):
                return jsonify({'success': False, 'message': 'Missing required fields'}), 400

            cursor.execute("""
                UPDATE [Smart_On_FHIR].[dbo].[Quality_Gaps]
                SET [MeasureValue]=?
                WHERE [MemberID]=? AND [MeasureName]=?
            """, (measure_value, member_id, measure_name))
            conn.commit()

            # ✅ Return updated values
            updated_measure = {
                'measure_name': measure_name,
                'measure_value': measure_value,
                'note': note,
                'member_Id': member_id
            }

            return jsonify({'success': True, 'message': 'Measure updated successfully', 'updated_measure': updated_measure})

        except Exception as e:
            print("Error while updating measure:", str(e))
            return jsonify({'success': False, 'message': 'An error occurred while updating measure'}), 500



@email_app.route('/api/update-diagnoses', methods=['POST'])
def update_diagnoses():
    access_token = session.get('access_token')
    if not access_token:
        return redirect("http://localhost:5000")
    else:
        try:
            data = request.get_json()
            member_id = data.get('memberId')
            diagnosis = data.get('newDiagnosis')

            diagnosis_code = diagnosis.get('DgnsCD')
            diagnosis_description = diagnosis.get('DiagnosisDescription')
            diagnosis_CY = diagnosis.get('Diag_CY')
            diagnosis_PY = diagnosis.get('Diag_PY')
            hcc_code = diagnosis.get('HCCCODE')  # Only if needed later

            print(f"Received update for Member ID: {member_id}")
            print(f"Diagnosis Code: {diagnosis_code}")
            print(f"Diagnosis Description: {diagnosis_description}")
            print(f"Diag PY: {diagnosis_PY}, Diag CY: {diagnosis_CY}")

            query = """
                UPDATE [Smart_On_FHIR].[dbo].[HCC_Details]
                SET [Diag PY]=?, [Diag CY]=?
                WHERE [MemberID]=? AND [DIAG Code]=?
            """
            values = (
                diagnosis_PY,
                diagnosis_CY,
                member_id,
                diagnosis_code
            )

            cursor.execute(query, values)
            conn.commit()
            print('Updated successfully.')

            return jsonify({'success': True, 'message': 'Diagnosis updated successfully'})

        except Exception as e:
            print(f"Error updating diagnosis: {e}")
            return jsonify({'success': False, 'message': 'Failed to update diagnosis', 'error': str(e)}), 500

@email_app.route('/api/logout', methods=['POST'])
def logout():
    try:
        # Clear the user session
        session.clear()
        
        # Optionally: Add headers to expire the session cookie immediately
        response = jsonify({
            "status": "success",
            "message": "Logged out successfully"
        })
        
        # Force cookie expiration (optional but recommended)
        response.set_cookie(
            "session",  # Use your actual session cookie name
            value='',
            expires=0,
            path='/',
            secure=email_app.config["SESSION_COOKIE_SECURE"],
            httponly=email_app.config["SESSION_COOKIE_HTTPONLY"],
            samesite=email_app.config["SESSION_COOKIE_SAMESITE"]
        )
        
        return response
    
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == "__main__":
    email_app.run(port=7002, debug=True)

