import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDraftExperiments } from '@/hooks/useDraftExperiments';
import { useExperiments } from '@/hooks/useExperiments';
import { ExperimentsTable } from './experiments-table';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { useRouterState } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import { SkeletonLoading } from '@/components/skeleton-loading';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { DraftExperiment, Experiment } from '@/api-types';

export const ExperimentsTabsViewWithTable = () => {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });
  const {
    data: experiments,
    refetch: refetchExperiments,
    isRefetching: isRefetchingExperiments,
  } = useExperiments();
  const {
    data: draftExperiments,
    refetch: refetchDraftExperiments,
    isRefetching: isRefetchingDraftExperiments,
  } = useDraftExperiments();
  const {
    location: { hash },
  } = useRouterState();
  const [activeTab, setActiveTab] = useState('experiments');
  const [filteredData, setFilteredData] = useState<
    Experiment[] | DraftExperiment[]
  >([]);

  useEffect(() => {
    const filterDataByDateRange = (exp?: Experiment[] | DraftExperiment[]) => {
      if (date && date.from && date.to && exp && exp.length > 0) {
        const filtered = exp.filter((item) => {
          if (item.date) {
            const itemDate = new Date(item.date);
            return (
              date.from &&
              date.to &&
              itemDate >= date.from &&
              itemDate <= date.to
            );
          }
        });
        setFilteredData(filtered);
      }
    };

    if (activeTab === 'experiments') {
      filterDataByDateRange(experiments);
    } else {
      filterDataByDateRange(draftExperiments);
    }
  }, [activeTab, date, experiments, draftExperiments]);

  useEffect(() => {
    if (hash !== '') {
      setActiveTab(hash);
    }
  }, [hash]);

  const onClickRefresh = () => {
    if (activeTab === 'experiments') {
      refetchExperiments();
    } else {
      refetchDraftExperiments();
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('dashboard')}
          </h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker setDate={setDate} date={date} />
            <CSVLink
              data={
                activeTab === 'experiments'
                  ? (experiments ?? [])
                  : (draftExperiments ?? [])
              }
              headers={[
                { label: 'ID', key: 'id' },
                { label: 'Name', key: 'name' },
                { label: 'Date', key: 'date' },
                { label: 'Description', key: 'description' },
              ]}
              filename="filtered_data.csv"
            >
              <Button disabled={filteredData.length === 0}>
                {t('download')}
              </Button>
            </CSVLink>
          </div>
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="experiments">{t('experiments')}</TabsTrigger>
            <TabsTrigger value="draft-experiments">
              {t('draft-experiments')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="experiments" className="space-y-4">
            <Suspense fallback={<SkeletonLoading />}>
              <ExperimentsTable
                isRefetching={isRefetchingExperiments}
                data={experiments ?? []}
                onClickRefresh={onClickRefresh}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="draft-experiments" className="space-y-4">
            <Suspense fallback={<SkeletonLoading />}>
              <ExperimentsTable
                isDraft
                isRefetching={isRefetchingDraftExperiments}
                data={draftExperiments ?? []}
                onClickRefresh={onClickRefresh}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
