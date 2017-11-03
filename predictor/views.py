from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render
from predictor.models import *
import pandas as pd
import numpy as np
import json

# Keras libraries
from keras.utils import np_utils, generic_utils
from keras.models import Sequential, load_model
from keras.layers import Dense, Activation
from keras.layers import Dropout
from keras.constraints import *
from keras import regularizers
from keras import metrics

def index(request):
    return render(request, "index.html")

def use_case_2(request):    
    return render(request, "use_case_2.html")

def use_case_3(request):
    return render(request, "index.html")

def use_case_4(request):
    return render(request, "index.html")

def use_case_5(request):
    return render(request, "index.html")

def use_case_6(request):
    return render(request, "index.html")

@csrf_exempt
def predict(request):
    data_template = ['Acct Assignment Cat._7', 'Acct Assignment Cat._8', 'Acct Assignment Cat._9', 'Acct Assignment Cat._A',
        'Acct Assignment Cat._C', 'Acct Assignment Cat._F', 'Acct Assignment Cat._K', 'Acct Assignment Cat._N',
        'Acct Assignment Cat._P', 'Acct Assignment Cat._R', 'Acct Assignment Cat._X', 'Order Unit_BA', 'Order Unit_BAG',
        'Order Unit_BOT', 'Order Unit_CAS', 'Order Unit_D', 'Order Unit_DAY', 'Order Unit_EA', 'Order Unit_G',
        'Order Unit_H', 'Order Unit_HR', 'Order Unit_M2', 'Order Unit_MON', 'Order Unit_PAC', 'Order Unit_PC',
        'Order Unit_PU', 'Order Unit_ROL']
    if request.is_ajax():
        user_data = json.loads(request.POST['data_input'])
        data_dict = {}
        for i in data_template:
            if i.split("_")[1] in user_data:
                data_dict[i] = 1
            else:
                data_dict[i] = 0
        print(user_data)
        data_df = pd.DataFrame([data_dict])
        with K.get_session().graph.as_default() as g:
            my_model = load_model('/home/tcs/po_model1_saved.h5')
            result = my_model.predict(data_df.values)
            output = result.tolist()[0]
        return JsonResponse({'ZCS0100': output[0], 'ZCS0500': output[1], 'ZIS1200': output[2]})
