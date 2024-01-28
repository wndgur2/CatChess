import Unit from "../Unit.js";

/**
 * @param {Unit} unit
 * @param {Unit} target
 */
function attackMotion(unit, target) {
    // rotate unit toward target
    const bodyMesh = unit.mesh.getObjectByName("unit");
    bodyMesh.lookAt(target.mesh.position);

    // move unit to target
    const duration = 12;
    let i = 0;
    function animate() {
        if (i < duration / 2) bodyMesh.translateZ(0.2);
        else bodyMesh.translateZ(-0.2);
        if (++i < duration) requestAnimationFrame(animate);
    }
    animate();
}

export default attackMotion;
