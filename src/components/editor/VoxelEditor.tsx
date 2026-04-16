import React, { useRef, useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Grid,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import { useEditorStore } from "../../store/editorStore";
import * as THREE from "three";

/* ─── Single voxel mesh ─── */
const Voxel: React.FC<{
    position: [number, number, number];
    color: string;
    isSelectedPiece: boolean;
    onClick: (e: any) => void;
    onHover: (e: any) => void;
    onHoverEnd: () => void;
    onRemove: () => void;
}> = ({
    position,
    color,
    isSelectedPiece,
    onClick,
    onHover,
    onHoverEnd,
    onRemove,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <mesh
            ref={meshRef}
            position={position}
            onClick={onClick}
            onPointerMove={onHover}
            onPointerOut={onHoverEnd}
            onContextMenu={(e) => {
                e.stopPropagation();
                onRemove();
            }}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={color}
                emissive="#000000"
                emissiveIntensity={isSelectedPiece ? 0.16 : 0}
            />
            <lineSegments raycast={() => {}}>
                <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
                <lineBasicMaterial
                    color="#000000"
                    linewidth={1}
                    transparent
                    opacity={isSelectedPiece ? 0.28 : 0.15}
                />
            </lineSegments>
        </mesh>
    );
};

/* ─── Ground plane for raycasting ─── */
const GroundPlane: React.FC<{
    onHoverChange: (pos: [number, number, number] | null) => void;
}> = ({ onHoverChange }) => {
    const { addVoxel, currentColor } = useEditorStore();

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            const point = e.point;
            const x = Math.round(point.x);
            const y = 0;
            const z = Math.round(point.z);
            addVoxel({ x, y, z }, currentColor);
        },
        [addVoxel, currentColor],
    );

    const handleHover = useCallback(
        (e: any) => {
            e.stopPropagation();
            const point = e.point;
            onHoverChange([Math.round(point.x), 0, Math.round(point.z)]);
        },
        [onHoverChange],
    );

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            onClick={handleClick}
            onPointerMove={handleHover}
            onPointerOut={() => onHoverChange(null)}>
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
};

const getPlacementPosition = (
    e: any,
    basePosition: [number, number, number],
): [number, number, number] | null => {
    if (!e.face) return null;

    const worldNormal = e.face.normal
        .clone()
        .transformDirection(e.object.matrixWorld);

    return [
        basePosition[0] + Math.round(worldNormal.x),
        basePosition[1] + Math.round(worldNormal.y),
        basePosition[2] + Math.round(worldNormal.z),
    ];
};

const GhostVoxel: React.FC<{ position: [number, number, number] }> = ({
    position,
}) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.14} />
            <lineSegments raycast={() => {}}>
                <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
                <lineBasicMaterial color="#000000" transparent opacity={0.35} />
            </lineSegments>
        </mesh>
    );
};

const AllPiecesFrame: React.FC<{
    voxels: ReturnType<typeof Object.values>;
}> = ({ voxels }) => {
    const frame = useMemo(() => {
        if (voxels.length === 0) return null;

        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        voxels.forEach((v: any) => {
            minX = Math.min(minX, v.position.x);
            minY = Math.min(minY, v.position.y);
            minZ = Math.min(minZ, v.position.z);
            maxX = Math.max(maxX, v.position.x);
            maxY = Math.max(maxY, v.position.y);
            maxZ = Math.max(maxZ, v.position.z);
        });

        const size: [number, number, number] = [
            maxX - minX + 1.06,
            maxY - minY + 1.06,
            maxZ - minZ + 1.06,
        ];

        const center: [number, number, number] = [
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2,
        ];

        return { size, center };
    }, [voxels]);

    if (!frame) return null;

    return (
        <lineSegments position={frame.center} raycast={() => {}}>
            <edgesGeometry
                args={[
                    new THREE.BoxGeometry(
                        frame.size[0],
                        frame.size[1],
                        frame.size[2],
                    ),
                ]}
            />
            <lineBasicMaterial
                color="#111111"
                transparent
                opacity={0.55}
                depthTest={false}
            />
        </lineSegments>
    );
};

/* ─── Voxel placement on existing faces ─── */
const VoxelFaceDetector: React.FC<{
    position: [number, number, number];
    color: string;
    pieceId: number;
    isSelectedPiece: boolean;
    voxelKey: string;
    onHoverChange: (pos: [number, number, number] | null) => void;
}> = ({
    position,
    color,
    pieceId,
    isSelectedPiece,
    voxelKey,
    onHoverChange,
}) => {
    const { addVoxel, removeVoxel, currentColor, selectPiece } =
        useEditorStore();

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            if (e.shiftKey) {
                selectPiece(pieceId);
                return;
            }
            const next = getPlacementPosition(e, position);
            if (!next) return;
            const [x, y, z] = next;
            addVoxel({ x, y, z }, currentColor);
        },
        [addVoxel, currentColor, pieceId, position, selectPiece],
    );

    const handleHover = useCallback(
        (e: any) => {
            e.stopPropagation();
            const next = getPlacementPosition(e, position);
            onHoverChange(next);
        },
        [onHoverChange, position],
    );

    return (
        <Voxel
            position={position}
            color={color}
            isSelectedPiece={isSelectedPiece}
            onClick={handleClick}
            onHover={handleHover}
            onHoverEnd={() => onHoverChange(null)}
            onRemove={() => removeVoxel(voxelKey)}
        />
    );
};

/* ─── Main 3D Canvas ─── */
export const VoxelEditor: React.FC = () => {
    const { voxels, currentPieceId } = useEditorStore();
    const [hoverPosition, setHoverPosition] = useState<
        [number, number, number] | null
    >(null);
    const voxelEntries = Object.entries(voxels);

    const hoverKey = useMemo(() => {
        if (!hoverPosition) return null;
        return `${hoverPosition[0]},${hoverPosition[1]},${hoverPosition[2]}`;
    }, [hoverPosition]);

    const canShowGhost = hoverKey ? !voxels[hoverKey] : false;

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [8, 8, 8], fov: 50 }}
                gl={{ antialias: true, alpha: false }}
                onContextMenu={(e) => e.preventDefault()}>
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[10, 15, 10]}
                    intensity={0.8}
                    castShadow
                />
                <directionalLight position={[-5, 8, -5]} intensity={0.3} />

                {/* Sky */}
                <color attach="background" args={["#f5f5f5"]} />

                {/* Grid */}
                <Grid
                    args={[100, 100]}
                    position={[0, -0.5, 0]}
                    cellSize={1}
                    cellThickness={0.5}
                    cellColor="#d4d4d4"
                    sectionSize={5}
                    sectionThickness={1}
                    sectionColor="#a3a3a3"
                    fadeDistance={50}
                    fadeStrength={1}
                    infiniteGrid
                />

                {/* Ground for click-to-place */}
                <GroundPlane onHoverChange={setHoverPosition} />

                {/* Placement preview */}
                {hoverPosition && canShowGhost && (
                    <GhostVoxel position={hoverPosition} />
                )}

                {/* Frame around all pieces */}
                <AllPiecesFrame voxels={Object.values(voxels)} />

                {/* Voxels */}
                {voxelEntries.map(([key, voxel]) => (
                    <VoxelFaceDetector
                        key={key}
                        voxelKey={key}
                        position={[
                            voxel.position.x,
                            voxel.position.y,
                            voxel.position.z,
                        ]}
                        color={voxel.color}
                        pieceId={voxel.pieceId}
                        isSelectedPiece={voxel.pieceId === currentPieceId}
                        onHoverChange={setHoverPosition}
                    />
                ))}

                {/* Controls */}
                <OrbitControls
                    makeDefault
                    enablePan
                    enableZoom
                    enableRotate
                    mouseButtons={{
                        LEFT: THREE.MOUSE.LEFT,
                        MIDDLE: THREE.MOUSE.MIDDLE,
                        RIGHT: THREE.MOUSE.RIGHT,
                    }}
                />

                {/* Axis Gizmo */}
                <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
                    <GizmoViewport labelColor="white" axisHeadScale={0.8} />
                </GizmoHelper>
            </Canvas>
        </div>
    );
};
