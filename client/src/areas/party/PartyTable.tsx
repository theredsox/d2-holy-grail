import * as React from "react";
import Table, { TableProps } from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import { IPartyTableProps } from "./PartyTable";
import styled from "styled-components";
import { IPartyData, IUserGrailData } from "../../common/definitions/union/IPartyData";
import Icon, { IconProps } from "@material-ui/core/Icon/Icon";
import { DataTableColumnHeader } from "./components/DataTableColumnHeader";
import { PartyManager } from "./PartyManager";
import { IconWithProgress } from "../../common/components/IconWithProgress";
import { ItemTotal } from "./ItemTotal";

export interface IPartyTableProps {
  data: IPartyData;
}

interface IPartyTableState {
  data: IPartyData;
  sorted: string;
  isLoading: boolean;
}

class Stats {
  public uniqArm: number = 0;
  public uniqWep: number = 0;
  public uniqOth: number = 0;
  public set: number = 0;
  public rune: number = 0;
  public total: number = 0;
  public itemScore: number = 0;

  public constructor(public name: string) {}
}

class Overall {
  public uniqArm: string = "".padStart(ItemTotal.Armor, "0");
  public uniqWep: string = "".padStart(ItemTotal.Weapons, "0");
  public uniqOth: string = "".padStart(ItemTotal.Other, "0");
  public set: string = "".padStart(ItemTotal.Sets, "0");
  public rune: string = "".padStart(ItemTotal.Runes, "0");

  public uniqArmScores: number[] = Array(ItemTotal.Armor).fill(0);
  public uniqWepScores: number[] = Array(ItemTotal.Weapons).fill(0);
  public uniqOthScores: number[] = Array(ItemTotal.Other).fill(0);
  public setScores: number[] = Array(ItemTotal.Sets).fill(0);
  public runeScores: number[] = Array(ItemTotal.Runes).fill(0);

  public constructor(public name: string) {}

  public add(data: IUserGrailData) {
    if (!data) {
      return;
    }

    this.uniqArm = this.unionBits(this.uniqArm, data.uniqueArmor.foundBits);
    this.uniqWep = this.unionBits(this.uniqWep, data.uniqueWeapons.foundBits);
    this.uniqOth = this.unionBits(this.uniqOth, data.uniqueOther.foundBits);
    this.set = this.unionBits(this.set, data.sets.foundBits);
    this.rune = this.unionBits(this.rune, data.runes.foundBits);

    this.uniqArmScores = this.unionArrays(this.uniqArmScores, data.uniqueArmor.itemScores);
    this.uniqWepScores = this.unionArrays(this.uniqWepScores, data.uniqueWeapons.itemScores);
    this.uniqOthScores = this.unionArrays(this.uniqOthScores, data.uniqueOther.itemScores);
    this.setScores = this.unionArrays(this.setScores, data.sets.itemScores);
    this.runeScores = this.unionArrays(this.runeScores, data.runes.itemScores);
  }

  public getStats(): Stats {
    let party = new Stats("Totals");

    party.uniqArm = this.countMissing(this.uniqArm);
    party.uniqWep = this.countMissing(this.uniqWep);
    party.uniqOth = this.countMissing(this.uniqOth);
    party.set = this.countMissing(this.set);
    party.rune = this.countMissing(this.rune);

    party.total = party.uniqArm + party.uniqWep + party.uniqOth + party.set + party.rune;
    party.itemScore = 
      this.sumItems(this.uniqArmScores) + 
      this.sumItems(this.uniqWepScores) + 
      this.sumItems(this.uniqOthScores) + 
      this.sumItems(this.setScores) +
      this.sumItems(this.runeScores);

    return party;
  }

  private countMissing(bitstring: string): number {
    return ((bitstring || '').match(/0/g) || []).length;
  }

  private sumItems(items: number[]) {
    return items && items.length > 0 ? items.reduce((sum, item) => sum + item) : 0;
  }

  // Unions two bitarrays; (["001"], ["101"]) => ["101"]
  private unionArrays(sum: number[], toUnion: number[]): number[] {

    if (!sum || sum.length == 0) {
      return toUnion;
    }

    if (!toUnion || toUnion.length == 0) {
      return sum;
    }

    let union = [];
    let max = Math.max(sum.length, toUnion.length);
    for (let i = 0; i < max; i++) {
      union.push(Math.max(sum[i], toUnion[i]));
    }
    return union;
  }

  // Unions two bitstrings; ("001", "101") => "101"
  private unionBits(sum: string, toUnion: string): string {

    if (sum === "") {
      return toUnion;
    }

    if (toUnion === "") {
      return sum;
    }

    let union = ""
    let max = Math.max(sum.length, toUnion.length);
    for (let i = 0; i < max; i++) {
      union += sum[i] === "1" || toUnion[i] === "1" ? "1" : "0";
    }
    return union;
  }
}

export class PartyTable extends React.Component<
  IPartyTableProps,
  IPartyTableState
> {
  public constructor(props: IPartyTableProps) {
    super(props);
    this.state = {
      data: props.data,
      sorted: "total",
      isLoading: false
    };
  }

  public static getDerivedStateFromProps(
    props: IPartyTableProps,
    state: IPartyTableState
  ) {
    state.data = props.data;
    return state;
  }

  public render() {
    let stats: Stats[] = [];
    let partyStats: Stats;

    if (this.state.data.users) {
      let overall = new Overall("Overall");
      for (let i = 0; i < this.state.data.users.length; i++) {
        let user = this.state.data.users[i];
        let statRow = new Stats(user.username);
        statRow.uniqArm = user.data
          ? user.data.uniqueArmor.missing
          : ItemTotal.Armor;
        statRow.uniqWep = user.data
          ? user.data.uniqueWeapons.missing
          : ItemTotal.Weapons;
        statRow.uniqOth = user.data
          ? user.data.uniqueOther.missing
          : ItemTotal.Other;
        statRow.set = user.data ? user.data.sets.missing : ItemTotal.Sets;
        statRow.rune = user.data ? user.data.runes.missing : ItemTotal.Runes;
        statRow.itemScore = user.data ? user.data.itemScore : 0;
        statRow.total =
          statRow.uniqArm + statRow.uniqWep + statRow.uniqOth + statRow.set + statRow.rune;
        stats.push(statRow);

        overall.add(user.data);
      }
      
      this.sortData(stats, this.state.sorted);

      partyStats = overall.getStats();
    }

    return (
      <div>
        <Typography variant="h6" align={"center"}>
          Holy Grail Leaders
          <IconWithProgress
            title="Refresh data"
            onClick={this.refreshData}
            isLoading={this.state.isLoading}
            icon="refresh"
          />
        </Typography>
        <StyledPaper>
          <StyledTable>
            <TableHead>
              <TableRow>
                <StyledTableCell>&nbsp;</StyledTableCell>
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Total"
                  sortText="total"
                  showIcon={this.state.sorted === "total"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Unique Armor"
                  sortText="uniqArm"
                  showIcon={this.state.sorted === "uniqArm"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Unique Weapons"
                  sortText="uniqWep"
                  showIcon={this.state.sorted === "uniqWep"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Unique Other"
                  sortText="uniqOth"
                  showIcon={this.state.sorted === "uniqOth"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Sets"
                  sortText="set"
                  showIcon={this.state.sorted === "set"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Runes"
                  sortText="rune"
                  showIcon={this.state.sorted === "rune"}
                />
                <DataTableColumnHeader
                  onClick={this.changeSortingState}
                  text="Item Score"
                  sortText="itemScore"
                  showIcon={this.state.sorted === "itemScore"}
                  secondIcon={"info"}
                  secondIconText={
                    "ItemScore is a measure of the total rarity of the items found in each grail.\nRarer items like Tyrael's contribute a large ItemScore (1000 pts), while common items like Venom Ward contribute a small ItemScore (1 pt).\nA finished grail will have an ItemScore of 10000."
                  }
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.length !== 0 &&
                stats.map((s, i) => PartyTable.renderRow(s, i % 2 === 0, false))}
              {stats.length !== 0 && PartyTable.renderRow(partyStats, stats.length % 2 === 0, true)}
              {stats.length === 0 && PartyTable.renderEmptyRow()}
            </TableBody>
          </StyledTable>
        </StyledPaper>
        <StyledPaper>
          <TableFootNote variant="body2">
            Notes:
            <NoteList>
              <li>The numbers above are the number of missing items.</li>
              <li>
                A grail has to be saved at least once for numbers / scores to
                appear in the table.
              </li>
            </NoteList>
          </TableFootNote>
        </StyledPaper>
      </div>
    );
  }

  private static renderRow(stats: Stats, isSelected?: boolean, party?: boolean) {
    return (
      <StyledTableRow key={`${stats.name}Stat`} hover={true} selected={isSelected} className={party ? "partyRow" : ""}>
        <StyledTableCell component="th" scope="row">
          <RowHeader>
            {stats.total === 0 && !party && (
              <PerfectIcon title="This user has completed their grail!">
                star
              </PerfectIcon>
            )}
            {stats.total === 0 && party && (
              <PerfectIcon title="The party has completed the grail as a group!">
                star
              </PerfectIcon>
            )}
            {!party ? (
            <UserLink
              href={"/" + stats.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {stats.name}
            </UserLink>) :
            (<span style={{cursor: "default"}}>{stats.name}</span>)}
          </RowHeader>
        </StyledTableCell>
        <StyledTableCell>{stats.total}</StyledTableCell>
        <StyledTableCell>{stats.uniqArm}</StyledTableCell>
        <StyledTableCell>{stats.uniqWep}</StyledTableCell>
        <StyledTableCell>{stats.uniqOth}</StyledTableCell>
        <StyledTableCell>{stats.set}</StyledTableCell>
        <StyledTableCell>{stats.rune}</StyledTableCell>
        <StyledTableCell>{stats.itemScore > -1 ? (stats.itemScore) : ('N/A')}</StyledTableCell>
      </StyledTableRow>
    );
  }

  private static renderEmptyRow() {
    return (
      <TableRow key={`$EmptyStat`} hover={true}>
        <StyledTableCell component="th" scope="row" colSpan={7}>
          <RowHeader>"No members yet! Ask them to join."</RowHeader>
        </StyledTableCell>
      </TableRow>
    );
  }

  private changeSortingState = (newState: string) => {
    if (newState !== this.state.sorted) {
      this.setState({
        sorted: newState
      });
    }
  };

  private sortData = (data: Stats[], key: string) => {
    data.sort((a: Stats, b: Stats) => {
      return key === "itemScore" ? b[key] - a[key] : a[key] - b[key];
    });
  };

  private refreshData = () => {
    this.setState({
      isLoading: true
    });
    PartyManager.current.refreshData().subscribe(
      () => {
        this.setState({
          isLoading: false
        });
      },
      err => {
        this.setState({
          isLoading: false
        });
      }
    );
  };
}

const StyledPaper: React.ComponentType<PaperProps> = styled(Paper)`
  && {
    max-width: 800px;
    margin: ${p => p.theme.spacing(1) * 3}px auto auto;
    overflow-x: auto;
  }
`;

const StyledTableCell: React.ComponentType<TableCellProps> = styled(TableCell)`
  && {
    padding: 14px 40px 14px 24px;
  }
`;

const StyledTable: React.ComponentType<TableProps> = styled(Table)`
  && {
    max-width: 800px;
    text-align: center;
  }
`;

const UserLink = styled.a`
  text-decoration: none;
  color: #000000;
`;

const RowHeader = styled.div`
  display: flex;
`;

const PerfectIcon: React.ComponentType<IconProps> = styled(Icon)`
  && {
    float: left;
    font-size: 1rem;
    margin-left: -16px;
  }
`;

const TableFootNote = styled(Typography)`
  && {
    margin: ${p => p.theme.spacing(1)}px;
  }
`;

const NoteList = styled.ul`
  margin-top: 0;
  padding-left: ${p => p.theme.spacing(3)}px;
`;

const StyledTableRow: React.ComponentType<TableRowProps> = styled(TableRow)`
  &.partyRow {
    border-top: 2px solid rgb(191 191 191);
    box-shadow: 0 -5px 5px rgb(0 0 0 / 10%);
  }
`