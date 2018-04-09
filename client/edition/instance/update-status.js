module.exports = ($, instanceDoc) => {
    $('select[data-doc-level="Enum:Status"]', instanceDoc).on('change', function() {
        const statusValue = $(this).val();
        $('span[data-warpjs-placeholder="status"]', instanceDoc).removeClass(function(index, className) {
            return className.split(' ').filter((aClass) => aClass.indexOf('warpjs-status-') === 0).join(" ");
        });
        $('span[data-warpjs-placeholder="status"]', instanceDoc).addClass(`warpjs-status-${statusValue}`);
        $('span[data-warpjs-placeholder="status"] span.warpjs-status-value', instanceDoc).text(statusValue);
    });
};
