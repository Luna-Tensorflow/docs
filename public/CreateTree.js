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

        //initialize each of the top levels
        var tree = $(this);
        tree.addClass("treeMenu");
        tree.find('li').has("ul").each(function() {
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator glyphicon " + closedClass + "'></i>");
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
        //fire event from the dynamically added icon
        tree.find('.branch .indicator').each(function() {
            $(this).on('click', function() {
                $(this).closest('li').click();
            });
        });

        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function() {
            $(this).on('click', function(e) {
                $(this).closest('li').click();
            });
        });
    }
});

//Initialization of treeviews
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// define a new observer
var obs = new MutationObserver(function(mutations, observer) {
    // look through all mutations that just occured
    for (var i = 0; i < mutations.length; ++i) {
        // look through all added nodes of this mutation
        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
            // was a child added with ID of 'bar'?
            if (mutations[i].addedNodes[j].id == "treeMID") {
                $('#treeMID').treed();

                $(function() {
                    // Perform on every scroll
                    $(document).scroll(function() {
                        var data = $("#data");
                        var modules = data.children().children();
                        var scrollpos = $(document).scrollTop() + 100;
                        var start = 0;
                        var end = modules.length;
                        var c = 0;

                        while (start != end) {
                            c++;
                            var mid = start + Math.floor((end - start) / 2);
                            if ($(modules[mid]).offset().top < scrollpos)
                                start = mid + 1;
                            else
                                end = mid;
                        }

                        var startC = 0;
                        var endC = $(modules[start - 1]).children().length

                        while (startC != endC) {
                            c++;
                            var mid = startC + Math.floor((endC - startC) / 2);
                            if ($($(modules[start - 1]).children()[mid]).offset().top < scrollpos)
                                startC = mid + 1;
                            else
                                endC = mid;
                        }

                        var id = $($(modules[start - 1]).children()[startC - 1]).attr('id')
                        if (id != undefined) {
                            var url = window.location.href.split('#')[0] + "#" + id;
                            updateMenuActivity(url);
                        }
                    });
                });

                // The function actually applying the offset
                function offsetAnchor() {
                    if (location.hash.length !== 0) {
                        window.scrollTo(window.scrollX, window.scrollY - 50);
                    }
                }

                // Captures click events of all <a> elements with href starting with #
                $(document).on('click', 'a[href^="#"]', function(event) {
                    // Click events are captured before hashchanges. Timeout
                    // causes offsetAnchor to be called after the page jump.
                    window.setTimeout(function() {
                        offsetAnchor();
                    }, 0);
                });

                // Set the offset when entering page with hash present in the url
                window.setTimeout(offsetAnchor, 0);
            }
        }
    }
});

// have the observer observe for changes in children
obs.observe($("#menuPane").get(0), {
    childList: true
});

var getParents = function(elem) {
    // Set up a parent array
    var parents = [];
    // Push each parent element to the array
    for (; elem && elem !== document; elem = elem.parentNode) {
        parents.push(elem);
    }
    // Return our parent array
    return parents;
};

var updateMenuActivity = function(url) {
    $(".treeMenu li,a").removeClass("active");
    // passes on every "a" tag
    $(".treeMenu a").each(function() {
        // checks if its the same on the address bar
        if (url == (this.href)) {
            var parents = getParents(this);
            for (var i = 0; i < parents.length; i++) {
                if ($(parents[i]).attr("id") != "menuPane") {
                    if (i == 0) {
                        var activeItem = $(parents)[0];
                        console.log(checkIfInView($(activeItem)))
                        if (checkIfInView($(activeItem)) == false) {
                            console.log("off screen");
                            //activeItem.scrollIntoView(true);
                        }
                    }
                    if ($(parents[i]).is("li,a")) {
                        $(parents[i]).addClass('active');
                    }
                    if ($(parents[i]).attr("class") != "branch") {
                        $(parents[i]).css("display", "");
                        var openedClass = 'fa fa-caret-down';
                        var closedClass = 'fa fa-caret-right';
                        if (i > 1 && $(parents[i]).children('i:first').hasClass(closedClass)) {
                            var icon = $(parents[i]).children('i:first');
                            icon.toggleClass(openedClass + " " + closedClass);
                        }
                        $(parents[i]).children().css("display", "");
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