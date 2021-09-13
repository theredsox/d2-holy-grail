import * as React from "react";
import { Util } from "../../common/utils/Util";
import Table, { TableProps } from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import { Icon } from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import { GrailManager } from "./GrailManager";
import { GrailMode } from "./GrailMode";
import { IItem } from "../../common/definitions/union/IItem";
import { IStatisticsTableProps } from "./StatisticsTable";
import styled from "styled-components";

export interface IStatisticsTableProps {
  data: any;
}

interface IStatisticsTableSTate {
  data: any;
}

class Stats {
  public total: number = 0;
  public found: number = 0;
  public perfects: number = 0;

  public get renderValue(): number {
    return this.usePerfects ? this.perfects : this.found;
  }

  public constructor(
    public name: string,
    public icon?: string,
    public iconTooltip?: string,
    public usePerfects?: boolean
  ) {}
}

export class StatisticsTable extends React.Component<
  IStatisticsTableProps,
  IStatisticsTableSTate
> {
  public constructor(props: IStatisticsTableProps) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  public static getDerivedStateFromProps(
    props: IStatisticsTableProps,
    state: IStatisticsTableSTate
  ) {
    state.data = props.data;
    return state;
  }

  public render() {
    let stats: Stats[];

    switch (GrailManager.current.grailMode) {
      case GrailMode.Eth:
        stats = [
          this.calculateStats(
            () => this.state.data.uniques.armor,
            new Stats("Unique Armors")
          ),
          this.calculateStats(
            () => this.state.data.uniques.weapons,
            new Stats("Unique Weapons")
          ),
          this.calculateStats(
            () => this.state.data.uniques.other,
            new Stats("Unique Other")
          )
        ];
        break;
      case GrailMode.Runeword:
        stats = [
          this.calculateStats(() => this.state.data, new Stats("Runewords"))
        ];
        break;
      default:
        stats = [
          this.calculateStats(
            () => this.state.data.uniques.armor,
            new Stats("Unique Armors")
          ),
          this.calculateStats(
            () => this.state.data.uniques.weapons,
            new Stats("Unique Weapons")
          ),
          this.calculateStats(
            () => this.state.data.uniques.other,
            new Stats("Unique Other")
          ),
          this.calculateStats(() => this.state.data.sets, new Stats("Sets")),
          this.calculateStats(() => this.state.data.runes, new Stats("Runes"))
        ];
        break;
    }
    const totalStats = new Stats("Total");
    stats.reduce((accumulator, currentValue) => {
      accumulator.found += currentValue.found;
      accumulator.perfects += currentValue.perfects;
      accumulator.total += currentValue.total;
      return accumulator;
    }, totalStats);

    const totalPerfectStats = new Stats("Total Perfects");
    totalPerfectStats.usePerfects = true;
    totalPerfectStats.icon = "star";
    totalPerfectStats.iconTooltip = "Perfect items";
    totalPerfectStats.perfects = totalStats.perfects;
    totalPerfectStats.total = totalStats.total;

    return (
      <div>
        <Typography variant="h6" align={"center"}>
          Statistics
        </Typography>
        <StyledPaper>
          <StyledTable>
            <TableHead>
              <StyledRow>
                <StyledCell>&nbsp;</StyledCell>
                <StyledCell align="right">Exist</StyledCell>
                <StyledCell align="right">Owned</StyledCell>
                <StyledCell align="right">Remaining</StyledCell>
                <StyledCell align="right">% Completed</StyledCell>
              </StyledRow>
            </TableHead>
            <TableBody>
              {stats.map(s => StatisticsTable.renderRow(s))}
              {StatisticsTable.renderRow(totalStats, true)}
              {StatisticsTable.renderRow(totalPerfectStats)}
            </TableBody>
          </StyledTable>
        </StyledPaper>
      </div>
    );
  }

  private static renderRow(stats: Stats, isSelected?: boolean) {
    return (
      <StyledRow key={`${stats.name}Stat`} hover={true} selected={isSelected}>
        <StyledCell component="th" scope="row">
          <RowHeader>
            {stats.icon && <Icon title={stats.iconTooltip}>{stats.icon}</Icon>}
            {!stats.icon && stats.name}
          </RowHeader>
        </StyledCell>
        <StyledCell align="right">{stats.total}</StyledCell>
        <StyledCell align="right">{stats.renderValue}</StyledCell>
        <StyledCell align="right">{stats.total - stats.renderValue}</StyledCell>
        <StyledCell align="right">
          {(stats.total ? (stats.renderValue * 100) / stats.total : 0).toFixed(
            2
          )}
        </StyledCell>
      </StyledRow>
    );
  }

  private calculateStats(dataFunc: () => any, stats: Stats): Stats {
    let data = {};
    try {
      data = dataFunc();
    } catch (e) {
      // ignore error
    }

    if (!data) {
      return stats;
    }

    Object.keys(data).forEach(key => {
      const possibleItem = data[key] as IItem;
      if (Util.isItem(possibleItem)) {
        stats.total++;
        if (possibleItem.wasFound) {
          stats.found++;
        }
        if (possibleItem.isPerfect) {
          stats.perfects++;
        }
      } else {
        this.calculateStats(() => possibleItem, stats);
      }
    });
    return stats;
  }
}

const StyledPaper: React.ComponentType<PaperProps> = styled(Paper)`
  && {
    max-width: 800px;
    margin: 0px auto auto;
    overflow-x: auto;
    width: calc(100vw - 217px); 
  }
`;

const StyledTable: React.ComponentType<TableProps> = styled(Table)`
  && {
    max-width: 800px;
    width: calc(100vw - 217px); 
  }
`;

const StyledRow: React.ComponentType<TableRowProps> = styled(TableRow)`
  && {
    & > :first-child {
      padding-left: 16px;
    }
  }
`;

const StyledCell: React.ComponentType<TableCellProps> = styled(TableCell)`
  && {
    padding: 10px 5px 10px 5px;
    white-space: nowrap;
  }
`;

const RowHeader = styled.div`
  display: flex;
`;