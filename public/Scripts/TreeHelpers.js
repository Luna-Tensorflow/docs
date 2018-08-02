$.fn.extend({
    treed: function(o) {

        var openedClass = 'fa fa-caret-down';
        var closedClass = 'fa fa-caret-right';

        if (typeof o != 'undefined') {
            if (typeof o.openedClass != 'undefined') {
                openedClass = o.openedClass;
            }
            if (typeof o.closedClass != 'undefined') {
                closedClass = o.closedClass;
            }
        };

        var tree = $(this);
        tree.addClass("treeMenu");
        tree.find('li').has("ul").each(function() {
            var branch = $(this);
            branch.prepend("<i class='indicator " + closedClass + "'></i>");
            branch.addClass('branch');
            branch.on('click', function(e) {
                if (this == e.target) {
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });

        tree.find('.branch .indicator').each(function() {
            $(this).on('click', function() {
                $(this).closest('li').click();
            });
        });

        tree.find('.branch>button').each(function() {
            $(this).on('click', function(e) {
                $(this).closest('li').click();
            });
        });
    }
});


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var treeDataObserver = new MutationObserver(function(mutations, observer) {
    for (var i = 0; i < mutations.length; ++i) {
        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
            if (mutations[i].addedNodes[j].id == "treeMID") {
                $('#treeMID').treed();
                scrollableAfterDOMContentLoadedProperly();

                function offsetAnchor() {
                    if (location.hash.length !== 0) {
                        window.scrollTo(window.scrollX, window.scrollY - 100);
                    }
                }

                $(document).on('click', 'a[href^="#"]', function(event) {
                    window.setTimeout(function() {
                        offsetAnchor();
                        window.scrollBy(0, 50);
                    }, 0);

                    var url = window.location.href;
                    updateMenuActivity(url);
                });
                window.setTimeout(offsetAnchor, 0);

                if (window.location.hash != "") {
                    var url = encodeURI(window.location.hash);
                    location.href = url;
                    window.scrollBy(0, 50);
                }
            }
        }
    }
});

treeDataObserver.observe($("#menuPane").get(0), {
    childList: true
});

var getParents = function(elem) {
    var parents = [];
    for (; elem && elem !== document; elem = elem.parentNode) {
        parents.push(elem);
    }
    return parents;
};

var updateMenuActivity = function(url) {
    $(".treeMenu li,a,ul,i").removeClass("active");

    $(".treeMenu a").each(function() {
        if (url == (this.href)) {
            var parents = getParents(this);

            for (var i = 0; i < parents.length; i++) {
                if ($(parents[i]).attr("id") != "menuPane") {
                    if (i == 0) {
                        var activeItem = $(parents)[0];

                        if (checkIfInView($(activeItem)) == false) {
                            var wH = $(window).height();
                            var activeY = $(activeItem).offset().top - scrollY;
                            if (activeY > wH / 2) {
                                activeItem.scrollIntoView(false);
                            } else {
                                activeItem.scrollIntoView(true);
                            }
                        }
                    }

                    if ($(parents[i]).is("li") && i > 0) {
                        $(parents[i]).addClass('active');
                        $(parents[i]).children().addClass('active');
                    }

                    if (i > 1 && $(parents[i]).attr("class") != "branch") {
                        $(parents[i]).css("display", "");
                        var openedClass = 'fa fa-caret-down';
                        var closedClass = 'fa fa-caret-right';

                        if ($(parents[i]).children('i:first').hasClass(closedClass)) {
                            var icon = $(parents[i]).children('i:first');
                            icon.toggleClass(openedClass + " " + closedClass);
                        }

                        $(parents[i]).children().css("display", "");
                    }

                    if ($(parents[3]).children()[1] !== undefined) {
                        array = $(parents[3]).children()[1].href.split("_")

                        if (array[array.length - 1] == "Functions") {
                            $(parents[2]).children().css("display", "none");
                            var icon = $(parents[3]).children('i:first');
                            icon.removeClass(openedClass);
                            icon.addClass(closedClass);
                        }
                    }
                } else {
                    break;
                }
            }
        }
    });
};

function checkIfInView(elem, partial) {
    var container = $(".sidenav");
    var contHeight = container.height();
    var contTop = container.scrollTop();
    var contBottom = contTop + contHeight;

    var elemTop = $(elem).offset().top - container.offset().top;
    var elemBottom = elemTop + $(elem).height();

    var isTotal = (elemTop >= 0 && elemBottom <= contHeight);
    var isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= container.height())) && partial;

    return isTotal || isPart;
}

function scrollableAfterDOMContentLoadedProperly() {
    $(document).scroll(function() {
        $('.module_classes_class, .functions').each(function() {
            $(this).css('background-color', 'white');
            if (checkIfInView($(this), true) == true) {
                var url = window.location.href.split('#')[0] + "#" + $(this).attr('id');
                updateMenuActivity(url);
            }
        });
    });
}