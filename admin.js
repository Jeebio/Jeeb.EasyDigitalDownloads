if(!window.jQuery)
{
    console.log("jquery is not loaded");
}

function JeebCtr(curBtnUrl) {
    this.curBtnUrl = curBtnUrl;
    this.init();
};

JeebCtr.prototype.init = function () {
    const row = jQuery("#edd_settings\\[edd_jeeb_btnurl\\]").parent();
    row.prop("id", "jeeb-buttons-td");
    row.html("");

    var culture = jQuery("#edd_settings\\[edd_jeeb_btnlang\\]").val();
    var theme = jQuery("#edd_settings\\[edd_jeeb_btntheme\\]").val();
    this.load(culture, theme);
}

JeebCtr.prototype.onChange = function () {
    var culture = jQuery("#edd_settings\\[edd_jeeb_btnlang\\]").val();
    var theme = jQuery("#edd_settings\\[edd_jeeb_btntheme\\]").val();
    this.load(culture, theme);
};

JeebCtr.prototype.bind = function () {
    const self = this;
    jQuery("#edd_settings\\[edd_jeeb_btnlang\\]").change(function () {
        self.onChange();
    });
    jQuery("#edd_settings\\[edd_jeeb_btntheme\\]").change(function () {
        self.onChange();
    });
};

JeebCtr.prototype.load = function (culture, theme) {
    const self = this;
    const url = "https://jeeb.io/media/resources?culture=" + culture + "&filter=simple&theme=" + theme;
    jQuery.ajax({
        dataType: "json",
        url: url,
        success: function (response) {
            self.populate(response.resources);
        },
        error: function (err) {
            console.log(err);
        }
    });
};

JeebCtr.prototype.populate = function (buttons) {
    var raw = "<fieldset class=\"jeeb-buttons-container\">" +
              "{0}" +
              "</fieldset>";

    var name = "edd_settings[edd_jeeb_btnurl]";
    var content = "";
    var hasCurBtnUrl = !!this.curBtnUrl;
    var curBtnIndex = -1;
    if (hasCurBtnUrl) {
        for (var index = 0; index < buttons.length; index++)
            if (buttons[index].url === this.curBtnUrl) {
                curBtnIndex = index;
                break;
            }
    }

    for (var index = 0; index < buttons.length; index++) {
        var checked = curBtnIndex >= 0
            ? (curBtnIndex === index ? true : false)
            : index === 0 ? true : false;

        content += "<label>" +
            "<input type=\"radio\"  name=\"" + name + "\" value=\"" + buttons[index].url + "\"" + (checked ? "checked" : "") + ">" +
            "<img src=\"" + buttons[index].url + "\">" +
            "</label>" +
            "<br/>";
    }

    raw = raw.replace("{0}", content)
    jQuery("#jeeb-buttons-td").html("");
    jQuery("#jeeb-buttons-td").html(raw);
}

jQuery(document).ready(function() {
    const curBtnUrl = jQuery("#edd_settings\\[edd_jeeb_btnurl\\]").val();
    const jeeb = new JeebCtr(curBtnUrl);
    jeeb.bind();
});
