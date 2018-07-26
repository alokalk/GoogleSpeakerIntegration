from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import Greeting

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    return render(request, 'index.html')


def db(request):

	greeting = Greeting()
	greeting.save()

	greetings = Greeting.objects.all()

	return render(request, 'db.html', {'greetings': greetings})

def myview(request):
	from bs4 import BeautifulSoup
	import requests
	url = request.GET['url']
	num_lines = int(request.GET.get('summarylines','3'))
	req = requests.get(url)
	text = req.text
	soup = BeautifulSoup(text)
	import json
	summary = "Dummy summary"
	headers = {"X-Mashape-Key":"EQ7tTlDH2WmshjtswLeOXh3LwiYMp1DIZjNjsneFOmT2sSnHXx","Content-type":"application/x-www-form-urlencoded", "Accept":"application/json"};
	response = requests.post("https://textanalysis-text-summarization.p.mashape.com/text-summarizer-url", headers = headers, data={"sentnum":num_lines, "url":url})
	summary_data = json.loads(response.text);
	summary = ""
	for each in summary_data['sentences'] :
		summary += (each.encode('ascii', 'ignore')).decode("utf-8")
	finalstring = ""
	for data in soup.find_all('p'):
		finalstring += (data.text.encode('ascii','ignore')).decode('utf-8')
	import random
	blob_id = random.randint(4,250)
	result = {
		"summary" : summary,
		"blob"	: finalstring,
		"url" : url,
		"title" : soup.title.string
	}
	reading_item = {
		"summary":summary,
		"blob_id" : blob_id,
		"url": url,
		"title":soup.title.string,
		"entity": "Entity example",
		"text":summary
	}
	blob_item = {
		"id" : blob_id,
		"body" : finalstring
	}
	response = requests.post("https://actions-codelab-cf789.firebaseio.com/readinglist.json",data=reading_item)
	response = requests.post("https://actions-codelab-cf789.firebaseio.com/blobs.json",data=blob_item)
	return HttpResponse("Done")