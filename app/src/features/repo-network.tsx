import { useScreenSize } from "@visx/responsive";
import { useEffect, useRef, useState } from "react";
import { Link, Node } from "../components/network/types";
import * as d3 from "d3";
import ZoomableContainer from "../components/zoom";
import { NetworkVisx } from "../components/network/network-visx";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { NodeTooltip } from "../components/network/node-tooltip";
import { GraphData } from "../components/network/types";

type RepoNetworkProps = {
  data: GraphData;
};

export function RepoNetwork({ data }: RepoNetworkProps) {
  const [, forceUpdate] = useState(0);
  const { width, height } = useScreenSize();
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip<Node>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const forceRef = useRef<d3.Simulation<Node, Link>>();

  useEffect(() => {
    forceRef.current = d3
      .forceSimulation(data.nodes)
      .force("charge", d3.forceManyBody().strength(-10))
      .force("collide", d3.forceCollide().radius(3).iterations(5))
      .force(
        "link",
        d3
          .forceLink<Node, Link>(data.links)
          .id((d) => d.id)
          .strength(1)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", () => {
        forceUpdate((updateCount) => updateCount + 1);
      })
      .velocityDecay(0.8)
      .on("end", () => {
        console.log("Simulation ended");
      });

    return () => {
      forceRef.current?.stop();
    };
  }, [width, height, data]);
  return width < 10 ? null : (
    <div ref={containerRef}>
      <ZoomableContainer width={width} height={height}>
        <NetworkVisx
          data={data}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          tooltipData={tooltipData}
        />
      </ZoomableContainer>
      {tooltipData && (
        <TooltipInPortal
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          <NodeTooltip node={tooltipData} />
        </TooltipInPortal>
      )}
    </div>
  );
}
