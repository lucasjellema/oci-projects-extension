

export const processOciProfile = (message) => {


    const profile = message.profile;
    const ociNode = {}
    ociNode.id = profile.ocid;
    ociNode.name = profile.subtype + " " + profile.name;
    ociNode.url = message.ociUrl;
    ociNode.type = 'ociResource';
    ociNode.ocid = profile.ocid;
    ociNode.subtype = profile.subtype;
    ociNode.ociService = `${profile.ociService}`;
    const icon = resourceTypeImageMap[ociNode.subtype];
    if (icon) ociNode.image = 'images/oci-images/' + icon ;
    return ociNode

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