jQuery(document).ready(function() {
    "use strict";
    jQuery("#no_post_add").keyup(function() {
        var value = jQuery(this).val();
        value = value.replace(/^(0*)/, "");
        jQuery(this).val(value);
    });
    // End Subscribe Functionality

    jQuery('form').each(function() {
        var cmdcode = jQuery(this).find('input[name="cmd"]').val();
        var bncode = jQuery(this).find('input[name="bn"]').val();

        if (cmdcode && bncode) {
            jQuery('input[name="bn"]').val("Multidots_SP");
        } else if ((cmdcode) && (!bncode)) {
            jQuery(this).find('input[name="cmd"]').after("<input type='hidden' name='bn' value='Multidots_SP' />");
        }


    });

    jQuery(document).ready(function() {
        jQuery("#type").change(function() {
            var type = jQuery("#type").val();
            if (type == 'post') {
                jQuery(".parent_page_id_tr").hide();
                jQuery(".template_name_tr").hide();
            } else {
                jQuery(".parent_page_id_tr").show();
                jQuery(".template_name_tr").show();
            }

        });
    });

    function pages_content_getContent(editor_id, textarea_id) {
        if (typeof editor_id == 'undefined')
            editor_id = wpActiveEditor;
        if (typeof textarea_id == 'undefined')
            textarea_id = editor_id;
        if (jQuery('#wp-' + editor_id + '-wrap').hasClass('tmce-active') && tinyMCE.get(editor_id)) {
            return tinyMCE.get(editor_id).getContent();
        } else {
            return jQuery('#' + textarea_id).val();
        }
    }

    jQuery("#btn_submit").click(function(e) {
        var prefix_word = jQuery("#page_prefix").val();
        var pages_list = jQuery("#pages_list").val();
        var pages_content = pages_content_getContent('pages_content');
        var parent_page_id = jQuery("#page-filter").val();
        var template_name = jQuery("#template_name").val();
        var type = jQuery("#type").val();
        var postfix_word = jQuery("#page_postfix").val();
        var comment_status = jQuery("#comment_status").val();

        var page_status = jQuery("#page_status").val();
        var authors = jQuery("#authors").val();
        var excerpt_content = jQuery("#excerpt_content").val();
        var no_post_add = jQuery("#no_post_add").val();
        var mass_pages_posts_creator = jQuery("#mass_pages_posts_creator").val();

        if (pages_list.length == 0) {
            alert('Please enter list of Pages..');
            event.preventDefault();
            return false;
        }

        if (type == 'none') {
            alert('Please select the type..');
            event.preventDefault();
            return false;
        }
        jQuery.ajax({
            type: 'POST',
            data: {
                action: 'mpc_ajax_action',
                prefix_word: prefix_word,
                postfix_word: postfix_word,
                pages_list: pages_list,
                pages_content: pages_content,
                parent_page_id: parent_page_id,
                template_name: template_name,
                type: type,
                page_status: page_status,
                authors: authors,
                excerpt_content: excerpt_content,
                no_post_add: no_post_add,
                comment_status: comment_status,
                security: mass_pages_posts_creator
            },
            url: adminajax.ajaxurl,
            dataType: 'json',
            success: function(response) {
                if (response) {
                    jQuery("#createForm").css("display", "none");
                    jQuery("#message").addClass('view');
                    jQuery('html,body').animate({scrollTop: 0}, 'slow');
                    jQuery("#message").html('Pages/Posts Succesfully Created.. ');
                    responseTable(jQuery('#result').get(0),response); 
                } else {
                    jQuery("#message").addClass('view');
                    jQuery("#message").html('Something goes wrong..');
                }
            }
        });

    });

    jQuery(".pages_values").chosen({ width: '20%' });

    jQuery('body').on('keyup', '#page_filter_chosen input', function() {
        jQuery('#page-filter').html('');
        jQuery('#page_filter_chosen ul li.no-results').html('Please enter 3 or more characters');
        var value = jQuery(this).val();
        var valueLenght = value.replace(/\s+/g, '');
        var valueCount = valueLenght.length;
        var remainCount = 3 - valueCount;
        if (valueCount >= 3) {
            var no_result=jQuery('#page_filter_chosen ul li.no-results').get(0);
            createtag(no_result,'img', {'id':'ajax-loader','src' : plugin_vars.plugin_url + 'images/ajax-loader.gif'});
            var data = {
                'action': 'page_finder_ajax',
                'value': value
            };
            jQuery.post(ajaxurl, data, function(response) {
                data=JSON.parse(response);
                var page_filter=jQuery('#page-filter').get(0);
                page_filter=insertOptions(page_filter,data);
                jQuery('#page-filter option').each(function() {
                    jQuery(this).siblings("[value='" + this.value + "']").remove();
                });
                jQuery('#page-filter').trigger("chosen:updated");
                jQuery('#page-filter').chosen().change(function() {
                    jQuery('#page-filter').trigger("chosen:updated");
                });
                jQuery('#page_filter_chosen ul li.no-results').html('No result Found');
            });
        } else {
            if (remainCount > 0) {
                var no_result=jQuery('#page_filter_chosen ul li.no-results').get(0)
                var text = document.createTextNode('Please enter ' + remainCount + ' or more characters');
                no_result.appendChild(text);
            }
        }
    });
});


function createtag(element,tag,attributes){
    var tag=document.createElement(tag);
    setAllAttributes(tag,attributes);
    element.appendChild(tag);
    return document.getElementById(attributes['id']);    
}

function responseTable(element,response){
var table=createtag(element,'table',{'id': 'datatable'});
var thead=createtag(table,'thead',{'id': 'datahead'});
var headtitles=["Page/Post Id","Page/Post Name","Page/Post Status", "URL"];
createCustomRow(thead,'th',headtitles,{'id':'datath'});
var tbody=createtag(table,'tbody',{'id': 'databody'});
for(var i=0; i<response.length;i++){
    data=Object.values(response[i]);
    createCustomRow(tbody,'td',data,{'id' : 'datatd-'+i});
}
}
function createCustomRow(element,celltype,data,attributes){
    var tr=createtag(element,'tr',attributes);
    for(var i=0;i<data.length;i++){        
        var cell=createtag(tr,celltype,{'id': attributes['id']+'-'+celltype+'-'+i});
        var text = document.createTextNode(data[i]);
        cell.appendChild(text); 
        tr.appendChild(cell);
    }
}
function setAllAttributes(element,attributes){
    Object.keys(attributes).forEach(function (key) {
        element.setAttribute(key, attributes[key]);
        // use val
    });
    return element;
}
function insertOptions(parentElement,options){
    for(var i=0;i<options.length;i++){
        if(options[i].type=='optgroup'){
            optgroup=document.createElement("optgroup");
            optgroup=setAllAttributes(optgroup,options[i].attributes);
            for(var j=0;j<options[i].options.length;j++){
                option=document.createElement("option");
                option=setAllAttributes(option,options[i].options[j].attributes);
                option.textContent=options[i].options[j].name
                optgroup.appendChild(option);
            }
            parentElement.appendChild(optgroup);
        } else {
            option=document.createElement("option");
            option=setAllAttributes(option,options[i].attributes);
            option.textContent=allowSpeicalCharacter(options[i].name);
            parentElement.appendChild(option);
        }

    }
    return parentElement;
    
}
function allowSpeicalCharacter(str){
            return str.replace('&#8211;','–').replace("&gt;",">").replace("&lt;","<").replace("&#197;","Å");    
}