function get_WarpWorks() {
    if (!_WarpWorks)
        _WarpWorks = new WarpWorks (null, null, "Root", null);
    return _WarpWorks;
}

var _WarpWorks = null;
