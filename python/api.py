import socket
import urllib, json

ipaddress=socket.gethostbyname(socket.gethostname())
if ipaddress=="127.0.0.1":
    question = json.loads(open('data.json').read())
    print json.dumps(question);
else:
    url = urllib.urlopen("https://opentdb.com/api.php?amount=10&type=boolean");
    question = json.loads(url.read().decode());
        
    open('../python/data.json', 'w').close();

    with open('data.json', 'w') as outfile:
        json.dump(question, outfile);
        
    print json.dumps(question);

