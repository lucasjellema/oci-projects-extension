

export const processOciProfile = (message) => {


    const profile = message.profile;
    const ociNode = {}
    ociNode.id = profile.ocid;
    ociNode.name = profile.subtype+" "+profile.name;
    ociNode.url = message.ociUrl;
    ociNode.type = 'ociResource';
    ociNode.ocid = profile.ocid;
    ociNode.subtype = profile.subtype;
    ociNode.ociService = `oci${profile.ociService}`;

    return ociNode



//     let ociNode = findNodeByProperty(cy, 'ocid', profile.ocid);
//     if (!ociNode) {
//         ociNode = createNode(cy, profile.name);
//         ociNode.data('url', message.ociUrl);
//         ociNode.data('type', 'ociResource');
//         ociNode.data('ocid', profile.ocid);
//         ociNode.data('subtype', profile.subtype);
//         ociNode.data('ociService', `oci${profile.ociService}`);
//         ociNode.data('shape', 'rectangle');
//         // TODO set image with the proper OCI icon
//         const icon = resourceTypeImageMap[profile.subtype];
//         if (icon) ociNode.data('image', 'url("images/oci-images/' + icon + '")');
// //        ociNode.data('image', 'url("images/oci-images/Buckets.png")');

//         newNodes = newNodes.union(ociNode);
//     }
//     ociNode.data('compartment', profile.compartment);

//     if (profile.ociResourceReferences) {
//         profile.ociResourceReferences.forEach(ociReference => {
//             try {
//                 let refNode = findNodeByProperty(cy, 'ocid', ociReference.ocid);
//                 if (!refNode) {
//                     refNode = createNode(cy, ociReference.name);
//                     refNode.data('url', ociReference.href);
//                     refNode.data('ocid', ociReference.ocid);
//                     refNode.data('ociService', ociReference.service.toLowerCase());

//                     refNode.data('type', 'ociResource');
//                     refNode.data('subtype', ociReference.type.toLowerCase());
//                     refNode.data('shape', 'square');
//                     newNodes = newNodes.union(refNode);
//                 }

//                 // TODO set image with the proper OCI icon
//                 const icon = resourceTypeImageMap[ociReference.type];
//                 if (icon) refNode.data('image', 'url("images/oci-images/' + icon + '")');

//                 const edge = createEdge(cy, ociNode, refNode);
//                 edge.data('label', ociReference.type);
//             } catch (error) {

//             }
//         });
//     }

}


// note these images have been downloaded from OCI documentation: https://docs.oracle.com/en-us/iaas/Content/General/Reference/graphicsfordiagrams.htm
const resourceTypeImageMap = {
    'bucket': 'Buckets.png',
    'compartment': 'Compartments.png',
    'instance': 'VirtualMachine.png',
    'cluster': 'ContainerEngineForKubernetes.png',
    'volume': 'Volumes.png',
    'policy': 'Policies.png',
    'fnfunc': 'Functions.png',
    'fnapp': 'Functions.png',
    //'subnet': 'Subnets.png',
    'vnic': 'VNIC.png',
    'vcn': 'VirtualCloudNetworkVCN_red.png',
    'securitylist': 'Security-Lists.png',
    'vault': 'Vault.png'
}