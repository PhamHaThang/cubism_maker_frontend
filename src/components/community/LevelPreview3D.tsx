import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Level } from "../../types";

interface LevelPreview3DProps {
    level: Level;
}

const MAX_PREVIEW_VOXELS = 500;

const normalizeColor = (value: string): string => {
    if (!value) return "#9ca3af";
    return value.startsWith("#") ? value : `#${value}`;
};

export const LevelPreview3D: React.FC<LevelPreview3DProps> = ({ level }) => {
    const preview = useMemo(() => {
        const allVoxels: { pos: [number, number, number]; color: string }[] =
            [];

        (level.pieces || []).forEach((piece) => {
            const color = normalizeColor(piece.color);
            (piece.segments || []).forEach((segment) => {
                const [x = 0, y = 0, z = 0] = segment;
                allVoxels.push({ pos: [x, y, z], color });
            });
        });

        if (allVoxels.length === 0) {
            return {
                voxels: allVoxels,
                center: [0, 0, 0] as [number, number, number],
                cameraDistance: 8,
            };
        }

        const voxels = allVoxels.slice(0, MAX_PREVIEW_VOXELS);

        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        voxels.forEach((voxel) => {
            const [x, y, z] = voxel.pos;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            minZ = Math.min(minZ, z);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            maxZ = Math.max(maxZ, z);
        });

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        const depth = maxZ - minZ + 1;
        const maxSize = Math.max(width, height, depth);

        return {
            voxels,
            center: [
                (minX + maxX) / 2,
                (minY + maxY) / 2,
                (minZ + maxZ) / 2,
            ] as [number, number, number],
            cameraDistance: Math.max(8, maxSize * 1.8),
        };
    }, [level]);

    if (preview.voxels.length === 0) {
        return (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
                Empty model
            </div>
        );
    }

    return (
        <div className="absolute inset-0">
            <Canvas
                dpr={[1, 1.5]}
                frameloop="demand"
                camera={{
                    position: [
                        preview.cameraDistance,
                        preview.cameraDistance * 0.75,
                        preview.cameraDistance,
                    ],
                    fov: 45,
                }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[8, 12, 8]} intensity={0.85} />

                <group
                    position={[
                        -preview.center[0],
                        -preview.center[1],
                        -preview.center[2],
                    ]}>
                    {preview.voxels.map((voxel, index) => (
                        <mesh
                            key={`${voxel.pos.join(",")}-${index}`}
                            position={voxel.pos}>
                            <boxGeometry args={[0.95, 0.95, 0.95]} />
                            <meshStandardMaterial color={voxel.color} />
                        </mesh>
                    ))}
                </group>

                <OrbitControls
                    enablePan={false}
                    enableZoom
                    minDistance={3}
                    maxDistance={preview.cameraDistance * 2.2}
                    rotateSpeed={0.9}
                />
            </Canvas>
        </div>
    );
};
