Rabu Schedule Release Checklist
===============================

1. Update CHANGELOG (and README, if necessary)
3. Commit
2. `rake release shutdown`
4. Update version number in README
5. Update version number in Java code's "usage.txt"
6. Commit with 'Release X.Y.Z' as commit message
7. `git tag "release-X.Y.Z"`
8. `git push`
9. `git push --tags`
10. Add '+dev' to version number in README and "usage.txt"
11. Commit with message 'Started next version'
12. Copy release file to website
13. Announce to mailing list

Mailing list announcement template
---

Subject: Rabu X.Y.Z released

Rabu X.Y.Z has been released. You can download it from http://www.teamrabu.com/rabu.zip .

Changes:
[Paste in changelog]