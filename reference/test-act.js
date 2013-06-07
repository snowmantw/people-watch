act = {'from': 'Greg Weng', 'subject': 'Sent a message to you', 'star_activitied': true}
con = {'from':'Greg Weng', 'message': 'Some message...'}
e = {'name':'new-activity', 'type': 'message', data: {'activity': act, 'content': con}}
Notifier.trigger(e)

