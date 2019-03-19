jQuery(document).ready(function () {
    "use strict";
    jQuery("#no_post_add").keyup(function () {
        var value = jQuery(this).val();
        value = value.replace(/^(0*)/, "");
        jQuery(this).val(value);
    });
    // End Subscribe Functionality
    jQuery('form').each(function () {
        var cmdcode = jQuery(this).find('input[name="cmd"]').val();
        var bncode = jQuery(this).find('input[name="bn"]').val();

        if (cmdcode && bncode) {
            jQuery('input[name="bn"]').val("Multidots_SP");
        } else if ((cmdcode) && (!bncode)) {
            jQuery(this).find('input[name="cmd"]').after("<input type='hidden' name='bn' value='Multidots_SP' />");
        }
    });

    jQuery(document).ready(function () {
        jQuery("#type").change(function () {
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

    jQuery("#btn_submit").click(function (e) {
        var prefix_word = jQuery("#page_prefix").val();
        var pages_list = jQuery("#pages_list").val();
        var pages_content = pages_content_getContent('pages_content');
        var parent_page_id = jQuery("#parent_page_id").val();
        var type = jQuery("#type").val();
        var postfix_word = jQuery("#page_postfix").val();

        var page_status = jQuery("#page_status").val();
        var excerpt_content = jQuery("#excerpt_content").val();
        var no_post_add = jQuery("#no_post_add").val();
        var mass_pages_posts_creator = jQuery("#mass_pages_posts_creator").val();

        if (pages_list.length == 0) {
            alert('Please enter list of Pages..');
            event.preventDefault();
            return false;
        }

        if ('none' == type) {
            alert('Please select the type..');
            event.preventDefault();
            return false;
        }
        jQuery('#loader_gif').show();
        jQuery.ajax({
            type: 'POST',
            data: {
                action: 'mpc_ajax_action',
                prefix_word: prefix_word,
                postfix_word: postfix_word,
                pages_list: pages_list,
                pages_content: pages_content,
                parent_page_id: parent_page_id,
                type: type,
                page_status: page_status,
                excerpt_content: excerpt_content,
                no_post_add: no_post_add,
                security: mass_pages_posts_creator
            },
            url: adminajax.ajaxurl,
            dataType: 'html',
            before: function (response) {
                jQuery('#loader_gif').show();
            },
            success: function (response) {
                jQuery('#loader_gif').hide();
                if (response) {
                    jQuery("#createForm").css("display", "none");
                    jQuery("#message").addClass('view');
                    jQuery('html,body').animate({scrollTop: 0}, 'slow');
                    jQuery("#message").html('Pages/Posts Succesfully Created.. ');
                    jQuery("#result").append(response);
                } else {
                    jQuery("#message").addClass('view');
                    jQuery("#message").html('Something goes wrong..');
                }
            }
        });
    });
});