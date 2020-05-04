<?php
defined('ABSPATH') or wp_die('Nope, not accessing this');
$pro_url = "https://go.premio.io/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=";
?>
<link href="<?php echo esc_url(WCP_FOLDER_URL."assets/css/select2.min.css?ver=".WCP_FOLDER_VERSION) ?>" type="text/css" rel="stylesheet" />
<link href="<?php echo esc_url(WCP_FOLDER_URL."assets/css/admin-setting.css?ver=".WCP_FOLDER_VERSION) ?>" type="text/css" rel="stylesheet" />
<div class="wrap">
    <div class="key-table">
        <div class="modal-upgrade upgrade-block" id="folder-modal">
            <div class="easy-modal-inner">
                <div class="modal__wrap">
                    <p class="udner-title"> <strong class="text-primary"><?php esc_html_e('Unlock All Features', WCP_FOLDER); ?></strong> </p>
                    <div id="rpt_pricr" class="rpt_plans rpt_3_plans  rpt_style_basic">
                        <div class="">
                            <div class="rpt_plan  rpt_plan_0  ">
                                <div style="text-align:left;" class="rpt_title rpt_title_0">Basic</div>
                                <div class="rpt_head rpt_head_0">
                                    <div class="rpt_description rpt_description_0">
                                        <?php esc_html_e('For small website owners', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_price rpt_price_0">$25</div>
                                    <div class="rpt_description rpt_description_0 rpt_desc">
                                        <?php esc_html_e('Per year. Renewals for 25% off', WCP_FOLDER); ?>
                                    </div>
                                    <div style="clear:both;"></div>
                                </div>
                                <div class="rpt_features rpt_features_0">
                                    <div class="rpt_feature rpt_feature_0-0"><a href="javascript:void(0)" class="rpt_tooltip"><span                                                class="intool"><b></b><?php esc_html_e('Use Folders on 1 domain', WCP_FOLDER); ?></span><?php esc_html_e('1 website', WCP_FOLDER); ?>                                            <span                                                class="rpt_tooltip_plus"> +</span></a> </div>
                                    <div class="rpt_feature rpt_feature_1-1">
                                        <?php esc_html_e('Organize Pages, Posts and Media files', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_feature rpt_feature_0-2"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can add unlimited pages, posts and media files to your folders</span>Unlimited files<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-3"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create additional 2 tires of sub-folders</span>Sub-folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create unlimited folders and sub-folders. On the Free plan it is limited to 10 folders in total</span>Unlimited folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can use this feature to download all the content of any media library folder as a ZIP file.</span>Download folders as ZIP<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-5">
                                        <select data-key="0" class="multiple-options">
                                            <option data-header="Renewals for 25% off" data-price="25" value="<?php echo esc_url($pro_url."1") ?>">
                                                <?php esc_html_e("Updates & support for 1 year") ?>
                                            </option>
                                            <option data-header="For 2 years" data-price="39" value="<?php echo esc_url($pro_url."13") ?>">
                                                <?php esc_html_e("Updates & support for 2 years") ?>
                                            </option>
                                            <option data-header="For lifetime" data-price="79" value="<?php echo esc_url($pro_url."5") ?>">
                                                <?php esc_html_e("Updates & support for lifetime") ?>
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div style="clear:both;"></div>
                                <a target="_blank" href="https://go.premio.io/?edd_action=add_to_cart&amp;download_id=687&amp;edd_options[price_id]=1" class="rpt_foot rpt_foot_0">
                                    <?php esc_html_e('Buy now', WCP_FOLDER); ?>
                                </a>
                            </div>
                            <div class="rpt_plan  rpt_plan_1 rpt_recommended_plan ">
                                <div style="text-align:left;" class="rpt_title rpt_title_1">Plus<img class="rpt_recommended" src="<?php echo esc_url(WCP_FOLDER_URL."assets/images/rpt_recommended.png") ?>" style="top: 27px;"></div>
                                <div class="rpt_head rpt_head_1">
                                    <div class="rpt_description rpt_description_1">
                                        <?php esc_html_e('For businesses with multiple websites', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_price rpt_price_1">$59</div>
                                    <div class="rpt_description rpt_description_0 rpt_desc">
                                        <?php esc_html_e('Per year. Renewals for 25% off', WCP_FOLDER); ?>
                                    </div>
                                    <div style="clear:both;"></div>
                                </div>
                                <div class="rpt_features rpt_features_1">
                                    <div class="rpt_feature rpt_feature_1-0"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b><?php esc_html_e('Use Folders on 5 domains', WCP_FOLDER); ?></span><?php esc_html_e('5 website', WCP_FOLDER); ?><span class="rpt_tooltip_plus"> +</span></a> </div>
                                    <div class="rpt_feature rpt_feature_1-1">
                                        <?php esc_html_e('Organize Pages, Posts and Media files', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_feature rpt_feature_0-2"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can add unlimited pages, posts and media files to your folders</span>Unlimited files<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-3"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create additional 2 tires of sub-folders</span>Sub-folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create unlimited folders and sub-folders. On the Free plan it is limited to 10 folders in total</span>Unlimited folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can use this feature to download all the content of any media library folder as a ZIP file.</span>Download folders as ZIP<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-5">
                                        <select data-key="0" class="multiple-options">
                                            <option data-header="Renewals for 25% off" data-price="59" value="<?php echo esc_url($pro_url."2") ?>">
                                                <?php esc_html_e("Updates & support for 1 year") ?>
                                            </option>
                                            <option data-header="For 2 years" data-price="89" value="<?php echo esc_url($pro_url."14") ?>">
                                                <?php esc_html_e("Updates & support for 2 years") ?>
                                            </option>
                                            <option data-header="For lifetime" data-price="149" value="<?php echo esc_url($pro_url."7") ?>">
                                                <?php esc_html_e("Updates & support for lifetime") ?>
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div style="clear:both;"></div>
                                <a target="_blank" href="https://go.premio.io/?edd_action=add_to_cart&amp;download_id=687&amp;edd_options[price_id]=2" class="rpt_foot rpt_foot_1">
                                    <?php esc_html_e('Buy now', WCP_FOLDER); ?>
                                </a>
                            </div>
                            <div class="rpt_plan  rpt_plan_2 ">
                                <div style="text-align:left;" class="rpt_title rpt_title_2">
                                    <?php esc_html_e('Agency', WCP_FOLDER); ?>
                                </div>
                                <div class="rpt_head rpt_head_2">
                                    <div class="rpt_description rpt_description_2">
                                        <?php esc_html_e('For agencies who manage clients', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_price rpt_price_2">$99</div>
                                    <div class="rpt_description rpt_description_0 rpt_desc">
                                        <?php esc_html_e('Per year. Renewals for 25% off', WCP_FOLDER); ?>
                                    </div>
                                    <div style="clear:both;"></div>
                                </div>
                                <div class="rpt_features rpt_features_2">
                                    <div class="rpt_feature rpt_feature_2-0" style="padding: 0px 16px 6px">
                                        <select class="multiple-web-options">
                                            <option value="50_websites">50 websites</option>
                                            <option value="500_websites">500 websites</option>
                                            <option value="1000_websites">1000 websites</option>
                                        </select>
                                    </div>
                                    <div class="rpt_feature rpt_feature_1-1">
                                        <?php esc_html_e('Organize Pages, Posts and Media files', WCP_FOLDER); ?>
                                    </div>
                                    <div class="rpt_feature rpt_feature_0-2"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can add unlimited pages, posts and media files to your folders</span>Unlimited files<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-3"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create additional 2 tires of sub-folders</span>Sub-folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can create unlimited folders and sub-folders. On the Free plan it is limited to 10 folders in total</span>Unlimited folders<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-4"><a href="javascript:void(0)" class="rpt_tooltip"><span class="intool"><b></b>You can use this feature to download all the content of any media library folder as a ZIP file.</span>Download folders as ZIP<span class="rpt_tooltip_plus"> +</span></a></div>
                                    <div class="rpt_feature rpt_feature_0-5">
                                        <select data-key="0" class="multiple-options has-multiple-websites">
                                            <option data-option="1_year" data-header="Renewals for 25% off" data-price="99" value="<?php echo esc_url($pro_url."10") ?>">
                                                <?php esc_html_e("Updates & support for 1 year") ?>
                                            </option>
                                            <option data-option="2_year" data-header="For 2 years" data-price="149" value="<?php echo esc_url($pro_url."15") ?>">
                                                <?php esc_html_e("Updates & support for 2 years") ?>
                                            </option>
                                            <option data-option="lifetime" data-header="For lifetime" data-price="249" value="<?php echo esc_url($pro_url."12") ?>">
                                                <?php esc_html_e("Updates & support for lifetime") ?>
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div style="clear:both;"></div>
                                <a target="_blank" href="https://go.premio.io/?edd_action=add_to_cart&amp;download_id=687&amp;edd_options[price_id]=10" class="rpt_foot rpt_foot_2">
                                    <?php esc_html_e('Buy now', WCP_FOLDER); ?>
                                </a>
                            </div>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    <div class="text-center">
                        <form method="post" action="https://www.paypal.com/cgi-bin/webscr">
                            <p class="money-guaranteed"><span class="dashicons dashicons-yes"></span>
                                <?php esc_html_e("30 days money back guaranteed", WCP_FOLDER); ?>
                            </p>
                            <p class="money-guaranteed"><span class="dashicons dashicons-yes"></span>
                                <?php esc_html_e("The plugin will always keep working even if you don't renew your license", WCP_FOLDER); ?>
                            </p>
                        </form>
                        <div class="payments">
                            <img src="<?php echo esc_url(WCP_FOLDER_URL."assets/images/payment.png") ?>" alt="Payment" class="payment-img" />
                        </div>
                    </div>
                    <div class="folder-testimonial-list">
                        <div class="folder-testimonial">
                            <div class="testimonial-image"> <img src="<?php echo esc_url(WCP_FOLDER_URL."assets/images/client-image.jpg") ?>"> </div>
                            <div class="testimonial-data">
                                <div class="testimonial-title">A brilliant solution!</div>
                                <div class="testimonial-desc">I’ve used other folder plug-ins for my WordPress media files, but Folders is better than any of them. An uncluttered interface, intuitive to use, allows drag-and-drop and allows subfolders: exactly what I needed in a media library folder plug-in. I can’t believe it’s free!</div>
                                <div class="testimonial-author">- Trevor Jordan</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="<?php echo esc_url(WCP_FOLDER_URL."assets/js/select2.min.js?ver=".WCP_FOLDER_VERSION) ?>" type="text/javascript" ></script>
<script>
    var priceOptions = {"50_websites":{"1_year":{"price":99,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=10"},"2_year":{"price":149,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=15"},"lifetime":{"price":249,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=12"}},"500_websites":{"1_year":{"price":179,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=16"},"2_year":{"price":269,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=17"},"lifetime":{"price":449,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=18"}},"1000_websites":{"1_year":{"price":249,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=19"},"2_year":{"price":375,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=20"},"lifetime":{"price":619,"link":"https:\/\/go.premio.io\/?edd_action=add_to_cart&download_id=687&edd_options[price_id]=21"}}};
    jQuery(document).ready(function(){
        if(jQuery(".multiple-options").length) {
            jQuery(".multiple-options").select2({
                minimumResultsForSearch: -1
            });
        }
        if(jQuery(".multiple-web-options").length) {
            jQuery(".multiple-web-options").select2({
                minimumResultsForSearch: -1
            });
        }
//        priceOptions = jQuery.parseJSON(priceOptions);
        jQuery(document).on("change", ".multiple-options", function(){
            priceText = jQuery(this).find("option:selected").attr("data-header");
            thisValue = jQuery(this).val();
            thisPrice = jQuery(this).find("option:selected").attr("data-price");
            if(!jQuery(this).hasClass("has-multiple-websites")) {
                jQuery(this).closest(".rpt_plan").find("a.rpt_foot").attr("href", thisValue);
                jQuery(this).closest(".rpt_plan").find(".rpt_price").text("$" + thisPrice);
            } else {
                var webOption = jQuery(".multiple-web-options").val();
                var priceSettings = priceOptions[webOption];
                var yearPlan = jQuery(".multiple-options.has-multiple-websites option:selected").attr("data-option");
                if(priceSettings[yearPlan] != undefined) {
                    priceSettings = priceSettings[yearPlan];
                    thisValue = priceSettings.link;
                    thisPrice = priceSettings.price;
                }
            }
            jQuery(this).closest(".rpt_plan").find("a.rpt_foot").attr("href", thisValue);
            jQuery(this).closest(".rpt_plan").find(".rpt_price").text("$" + thisPrice);
            jQuery(this).closest(".rpt_plan").find(".rpt_desc").text(priceText);
        });

        jQuery(document).on("change", ".multiple-web-options", function(){
            jQuery(".multiple-options.has-multiple-websites").trigger("change");
        });
    });
</script>