
jQuery.validator.addMethod('email', function(value, element) {
	return this.optional(element) || /^[0-9a-zA-Z][0-9a-zA-Z._\-]*@[0-9a-zA-Z._\-]*[0-9a-zA-Z]$/.test(value);
}, 'Please enter a valid email address.');

jQuery.validator.addMethod('phone_dash', function(value, element) {
	return this.optional(element) || /^[0-9]+-[0-9]+-[0-9]+$/.test(value);
}, 'Please enter a valid phone number.');

jQuery.validator.addMethod('device_id', function(value, element) {
	return this.optional(element) || /^[0-9A-Za-z]{12}$/.test(value);
}, 'Please enter a valid Device Id.');

jQuery.validator.addMethod('required_file', function(value, element) {
	return this.optional(element) || $(element).attr('selected')=='selected';
}, 'Please enter a file.');

jQuery.validator.addMethod('natural', function(value, element) {
	return this.optional(element) || /^(([0-9])|([1-9]+[0-9]*))$/.test(value);
}, 'Please enter a valid number.');

jQuery.validator.addMethod('half_width', function(value, element) {
	return this.optional(element) || /^[ -~]+$/.test(value);
}, 'Please enter a half width string.');

jQuery.validator.addMethod('jis', function(value, element) {
	return this.optional(element) || /^[^\x00-\x09\x0B\x0C\x0E-\x1F\x7F｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑]+$/.test(value);
}, 'Please enter a acceptable character.');

jQuery.validator.addMethod('less_or_equal', function(value, element, param) {
	var target = $(param);
	var target_val = target.val();
	if (this.optional(element) || value==='' || target_val==='' || value-0 <= target_val-0)
	{
		if (target.parents('.form-group').hasClass(this.settings.errorClass))
		{
			target.parents('.form-group').removeClass(this.settings.errorClass).addClass(this.settings.successClass);
		}
		var target_id = target.attr('id');
		if (target_id != '')
		{
			target.parents('.form-group').find('[for="'+target_id+'"].'+this.settings.errorClass.replace(' ', '.')).remove();
		}
		return true;
	}
	return false;
}, $.validator.format("The value must be less than or equal to {0}"));

jQuery.validator.addMethod('greater_or_equal', function(value, element, param) {
	var target = $(param);
	var target_val = target.val();
	if (this.optional(element) || value==='' || target_val==='' || value-0 >= target_val-0)
	{
		if (target.parents('.form-group').hasClass(this.settings.errorClass))
		{
			target.parents('.form-group').removeClass(this.settings.errorClass).addClass(this.settings.successClass);
		}
		var target_id = target.attr('id');
		if (target_id != '')
		{
			target.parents('.form-group').find('[for="'+target_id+'"].'+this.settings.errorClass.replace(' ', '.')).remove();
		}
		return true;
	}
	return false;
}, $.validator.format("The value must be greater than or equal to {0}"));

jQuery.validator.addMethod('less', function(value, element, param) {
	var target = $(param);
	var target_val = target.val();
	if (this.optional(element) || value==='' || target_val==='' || value-0 < target_val-0)
	{
		if (target.parents('.form-group').hasClass(this.settings.errorClass))
		{
			target.parents('.form-group').removeClass(this.settings.errorClass).addClass(this.settings.successClass);
		}
		return true;
	}
	return false;
}, $.validator.format("The value must be less than {0}"));

jQuery.validator.addMethod('greater', function(value, element, param) {
	var target = $(param);
	var target_val = target.val();
	if (this.optional(element) || value==='' || target_val==='' || value-0 > target_val-0)
	{
		if (target.parents('.form-group').hasClass(this.settings.errorClass))
		{
			target.parents('.form-group').removeClass(this.settings.errorClass).addClass(this.settings.successClass);
		}
		return true;
	}
	return false;
}, $.validator.format("The value must be greater than {0}"));
