// import debug from './../../../debug';
// const log = debug('inline-edit/association-modal/orchestrators/sync-association-description');

const { proxy, toast } = window.WarpJS;

export default async (dispatch, item) => {
    const url = item._links.self.href;
    const data = {
        field: 'desc',
        value: event.target.value
    };

    const toastLoading = toast.loading($, "Updating description...");
    try {
        await proxy.patch($, url, data);
        toast.success($, "Updated description");
    } catch (err) {
        console.error("Error syncAssociationDescription(): err=", err);
        toast.error($, err.message, "Error!");
    } finally {
        toast.close($, toastLoading);
    }
};
